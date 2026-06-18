import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { MedicalResult } from "@/context/AppContext";

const CATEGORIES: {
  id: MedicalResult["category"];
  label: string;
  icon: string;
  color: string;
  bg: string;
}[] = [
  { id: "lab", label: "نتائج مختبر", icon: "droplet", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "xray", label: "أشعة / تصوير", icon: "image", color: "#0891B2", bg: "#E0F2FE" },
  { id: "prescription", label: "وصفة طبية", icon: "file-text", color: "#059669", bg: "#D1FAE5" },
  { id: "report", label: "تقرير طبي", icon: "clipboard", color: "#D97706", bg: "#FEF3C7" },
  { id: "other", label: "أخرى", icon: "folder", color: "#64748B", bg: "#F1F5F9" },
];

interface UploadingItem {
  docName: string;
  progress: number;
}

export default function MedicalRecordsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, setUserProfile } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const results: MedicalResult[] = userProfile.medicalResults ?? [];

  const [activeCategory, setActiveCategory] = useState<MedicalResult["category"] | "all">("all");
  const [uploading, setUploading] = useState<UploadingItem | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MedicalResult["category"]>("lab");
  const [noteText, setNoteText] = useState("");

  const filtered =
    activeCategory === "all"
      ? results
      : results.filter((r) => r.category === activeCategory);

  async function handleUpload() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: false,
        allowsMultipleSelection: false,
      });

      if (picked.canceled || !picked.assets[0]) return;

      const uri = picked.assets[0].uri;
      const filename = uri.split("/").pop() ?? "record";

      setShowAddSheet(false);
      setUploading({ docName: filename, progress: 0 });

      const tick = setInterval(() => {
        setUploading((prev) =>
          prev ? { ...prev, progress: Math.min(prev.progress + 12, 88) } : null
        );
      }, 250);

      try {
        const uploaded = await uploadToCloudinary(uri, "akseer/results");
        clearInterval(tick);
        setUploading({ docName: filename, progress: 100 });

        const newResult: MedicalResult = {
          id: `r_${Date.now()}`,
          title:
            CATEGORIES.find((c) => c.id === selectedCategory)?.label ??
            "نتيجة طبية",
          category: selectedCategory,
          cloudinaryUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
          uploadedAt: new Date().toLocaleDateString("ar-SA"),
          notes: noteText.trim() || undefined,
        };

        await setUserProfile({
          medicalResults: [...results, newResult],
        });

        setNoteText("");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setUploading(null), 600);
      } catch (err) {
        clearInterval(tick);
        setUploading(null);
        Alert.alert("خطأ في الرفع", "تعذّر رفع الملف، يرجى المحاولة مجدداً.");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch {
      setUploading(null);
    }
  }

  function deleteResult(id: string) {
    Alert.alert("حذف النتيجة", "هل تريد حذف هذه النتيجة نهائياً؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          await setUserProfile({
            medicalResults: results.filter((r) => r.id !== id),
          });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 24,
      overflow: "hidden",
    },
    headerOrb1: {
      position: "absolute",
      top: -50,
      right: -50,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: "rgba(37,156,244,0.2)",
    },
    headerOrb2: {
      position: "absolute",
      bottom: -20,
      left: -30,
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: "rgba(29,208,248,0.13)",
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 4,
    },
    headerSub: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    filterRow: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    filterText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    uploadProgress: {
      margin: 16,
      backgroundColor: colors.primaryLight,
      borderRadius: colors.radius + 2,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.primary + "40",
    },
    uploadProgressTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 10,
    },
    uploadProgressText: {
      fontSize: 13,
      color: colors.dark,
      fontFamily: "Inter_600SemiBold",
      flex: 1,
      textAlign: "right",
    },
    progressTrack: {
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
    progressPct: {
      fontSize: 12,
      color: colors.primary,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginTop: 4,
    },
    scroll: { flex: 1 },
    list: { padding: 16 },
    resultCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    resultIcon: {
      width: 50,
      height: 50,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    resultInfo: {
      flex: 1,
      alignItems: "flex-end",
    },
    resultTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
    },
    resultDate: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 4,
    },
    resultNotes: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    resultActions: {
      flexDirection: "column",
      gap: 6,
      alignItems: "center",
    },
    actionBtn: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    uploadedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.mintLight,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 100,
      alignSelf: "flex-end",
    },
    uploadedBadgeText: {
      fontSize: 11,
      color: colors.dark,
      fontFamily: "Inter_600SemiBold",
    },
    emptyBox: {
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 22,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 22,
    },
    fab: {
      position: "absolute",
      bottom: bottomPad + 100,
      left: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.dark,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 100,
      shadowColor: colors.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    fabText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_700Bold",
    },
    sheet: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: bottomPad + 20,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 16,
    },
    catGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 16,
    },
    catChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: colors.radius,
      borderWidth: 1.5,
    },
    catChipText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    noteInput: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 14,
      backgroundColor: colors.background,
      minHeight: 70,
      textAlignVertical: "top",
    },
    sheetUploadBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 14,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    sheetUploadBtnText: {
      color: "#FFF",
      fontSize: 15,
      fontFamily: "Inter_700Bold",
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#082D40", "#0E4D62", "#1A7066"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOrb1} pointerEvents="none" />
        <View style={styles.headerOrb2} pointerEvents="none" />
        <Text style={styles.headerTitle}>سجلاتي الطبية</Text>
        <Text style={styles.headerSub}>
          {results.length > 0
            ? `${results.length} وثيقة مرفوعة على Cloudinary`
            : "ارفع نتائج الفحوصات والوصفات بأمان"}
        </Text>
      </LinearGradient>

      {/* Category filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {[{ id: "all" as const, label: "الكل", icon: "grid", color: colors.dark, bg: colors.muted },
          ...CATEGORIES.map((c) => ({ ...c, id: c.id as "all" | MedicalResult["category"] })),
        ].map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? cat.bg : colors.card,
                  borderColor: active ? cat.color : colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveCategory(cat.id);
              }}
            >
              <Feather
                name={cat.icon as any}
                size={13}
                color={active ? cat.color : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.filterText,
                  { color: active ? cat.color : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Upload progress */}
      {uploading && (
        <View style={styles.uploadProgress}>
          <View style={styles.uploadProgressTop}>
            <Feather name="upload-cloud" size={18} color={colors.primary} />
            <Text style={styles.uploadProgressText}>
              جارٍ الرفع على Cloudinary...
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressBar, { width: `${uploading.progress}%` }]}
            />
          </View>
          <Text style={styles.progressPct}>{uploading.progress}%</Text>
        </View>
      )}

      {/* Results list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIcon}>
              <Feather name="folder" size={30} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>لا توجد سجلات بعد</Text>
            <Text style={styles.emptyText}>
              اضغط الزر أدناه لرفع أول{"\n"}فحص أو وصفة طبية
            </Text>
          </View>
        ) : (
          filtered.map((r) => {
            const cat = CATEGORIES.find((c) => c.id === r.category);
            return (
              <View key={r.id} style={styles.resultCard}>
                <View style={styles.resultActions}>
                  <Pressable
                    style={[
                      styles.actionBtn,
                      { backgroundColor: colors.destructiveLight },
                    ]}
                    onPress={() => deleteResult(r.id)}
                  >
                    <Feather
                      name="trash-2"
                      size={15}
                      color={colors.destructive}
                    />
                  </Pressable>
                  <Pressable
                    style={[
                      styles.actionBtn,
                      { backgroundColor: colors.primaryLight },
                    ]}
                    onPress={() =>
                      Alert.alert("رابط Cloudinary", r.cloudinaryUrl)
                    }
                  >
                    <Feather
                      name="external-link"
                      size={15}
                      color={colors.primary}
                    />
                  </Pressable>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>{r.title}</Text>
                  <Text style={styles.resultDate}>
                    {r.uploadedAt}
                  </Text>
                  {r.notes ? (
                    <Text style={styles.resultNotes}>{r.notes}</Text>
                  ) : null}
                  <View style={styles.uploadedBadge}>
                    <Feather name="cloud" size={10} color={colors.dark} />
                    <Text style={styles.uploadedBadgeText}>
                      محفوظ على Cloudinary
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.resultIcon,
                    { backgroundColor: cat?.bg ?? colors.muted },
                  ]}
                >
                  <Feather
                    name={(cat?.icon ?? "file") as any}
                    size={22}
                    color={cat?.color ?? colors.mutedForeground}
                  />
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: bottomPad + 120 }} />
      </ScrollView>

      {/* FAB */}
      {!showAddSheet && (
        <Pressable
          style={styles.fab}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowAddSheet(true);
          }}
        >
          <Feather name="upload-cloud" size={18} color="#FFF" />
          <Text style={styles.fabText}>رفع نتيجة جديدة</Text>
        </Pressable>
      )}

      {/* Bottom sheet */}
      {showAddSheet && (
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>رفع سجل طبي جديد</Text>

          {/* Category picker */}
          <View style={styles.catGrid}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: active ? cat.bg : colors.card,
                      borderColor: active ? cat.color : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedCategory(cat.id);
                  }}
                >
                  <Feather
                    name={cat.icon as any}
                    size={14}
                    color={active ? cat.color : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.catChipText,
                      { color: active ? cat.color : colors.mutedForeground },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Optional note */}
          <TextInput
            style={styles.noteInput}
            placeholder="ملاحظة اختيارية (مثال: فحص السكر - يناير 2026)"
            placeholderTextColor={colors.mutedForeground}
            value={noteText}
            onChangeText={setNoteText}
            multiline
          />

          <Pressable style={styles.sheetUploadBtn} onPress={handleUpload}>
            <Feather name="upload-cloud" size={18} color="#FFF" />
            <Text style={styles.sheetUploadBtnText}>
              اختر صورة وارفعها على Cloudinary
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
