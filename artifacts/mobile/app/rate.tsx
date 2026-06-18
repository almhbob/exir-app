import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, Rating } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const RATING_TAGS = [
  "دقيق في التشخيص",
  "سريع الاستجابة",
  "محترف",
  "ودود ومطمئن",
  "وصل في الوقت",
  "شرح واضح",
  "أنصح به",
];

export default function RateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookingId, doctorId, doctorName } = useLocalSearchParams<{
    bookingId: string;
    doctorId: string;
    doctorName: string;
  }>();
  const { addRating, markBookingRated } = useApp();

  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  function toggleTag(tag: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function submit() {
    if (stars === 0) {
      Alert.alert("تنبيه", "الرجاء اختيار تقييم النجوم أولاً");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const rating: Rating = {
      id: `rt${Date.now()}`,
      bookingId: bookingId || "",
      doctorId: doctorId || "",
      doctorName: doctorName || "",
      stars,
      tags: selectedTags,
      comment,
      createdAt: new Date().toLocaleDateString("ar-SA"),
    };

    await addRating(rating);
    if (bookingId) await markBookingRated(bookingId);

    setSubmitted(true);
  }

  const LABELS = ["", "سيئ", "مقبول", "جيد", "جيد جداً", "ممتاز"];
  const COLORS_MAP = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#10B981"];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 14,
      paddingHorizontal: 20,
      paddingBottom: 32,
      overflow: "hidden",
    },
    orb1: {
      position: "absolute", top: -50, right: -50,
      width: 160, height: 160, borderRadius: 80,
      backgroundColor: "rgba(37,156,244,0.2)",
    },
    backBtn: {
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
      alignItems: "center", justifyContent: "center",
      alignSelf: "flex-end", marginBottom: 16,
    },
    headerTitle: {
      fontSize: 22, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
      textAlign: "right", marginBottom: 4,
    },
    headerSub: {
      fontSize: 14, color: "rgba(255,255,255,0.72)",
      fontFamily: "Inter_400Regular", textAlign: "right",
    },

    content: { padding: 24, paddingBottom: 40 },

    sectionLabel: {
      fontSize: 13, color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold", textAlign: "right",
      marginBottom: 14, marginTop: 24,
      textTransform: "uppercase", letterSpacing: 0.5,
    },

    // Stars
    starsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 8,
    },
    starBtn: { padding: 4 },
    ratingLabel: {
      fontSize: 18, fontWeight: "700",
      textAlign: "center", fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    ratingDesc: {
      fontSize: 13, color: colors.mutedForeground,
      textAlign: "center", fontFamily: "Inter_400Regular",
      marginBottom: 4,
    },

    // Tags
    tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" },
    tagChip: {
      paddingHorizontal: 14, paddingVertical: 9,
      borderRadius: 100, borderWidth: 1.5,
    },
    tagText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

    // Comment
    commentBox: {
      backgroundColor: colors.card,
      borderRadius: 16, borderWidth: 1.5,
      borderColor: colors.border,
      padding: 16, minHeight: 110,
      textAlign: "right",
      fontSize: 14, color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 22,
    },
    commentFocus: { borderColor: colors.primary },

    submitBtn: {
      borderRadius: 16, paddingVertical: 17,
      alignItems: "center", overflow: "hidden",
      marginTop: 28,
    },
    submitText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },

    // Success
    successContainer: {
      flex: 1, alignItems: "center", justifyContent: "center", padding: 32,
    },
    successCircle: {
      width: 100, height: 100, borderRadius: 50,
      backgroundColor: "#DCFCE7",
      alignItems: "center", justifyContent: "center",
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24, fontWeight: "700",
      color: colors.foreground, fontFamily: "Inter_700Bold",
      textAlign: "center", marginBottom: 8,
    },
    successSub: {
      fontSize: 15, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "center",
      lineHeight: 24, marginBottom: 32,
    },
    backHomeBtn: {
      borderRadius: 16, paddingVertical: 16, paddingHorizontal: 32,
      alignItems: "center", overflow: "hidden",
    },
    backHomeBtnText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  });

  if (submitted) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.successCircle}>
          <Feather name="check" size={48} color="#16A34A" />
        </View>
        <Text style={styles.successTitle}>شكراً على تقييمك! 🌟</Text>
        <Text style={styles.successSub}>
          رأيك يساعدنا في تحسين الخدمة{"\n"}ويساعد مرضى آخرين في اتخاذ قراراتهم
        </Text>
        <Pressable
          style={styles.backHomeBtn}
          onPress={() => router.replace("/(patient)/bookings")}
        >
          <LinearGradient
            colors={["#0E4D62", "#1E8070"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
          />
          <Text style={styles.backHomeBtnText}>عرض حجوزاتي</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#051C2C", "#0E4D62", "#1A7066"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.orb1} pointerEvents="none" />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>قيّم تجربتك</Text>
        <Text style={styles.headerSub}>
          {doctorName || "الطبيب"} — رأيك يصنع فارقاً
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Stars */}
          <Text style={styles.sectionLabel}>التقييم العام</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                style={styles.starBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setStars(n);
                }}
              >
                <Feather
                  name="star"
                  size={42}
                  color={n <= (hovered || stars) ? "#F59E0B" : colors.border}
                />
              </Pressable>
            ))}
          </View>

          {stars > 0 && (
            <Text style={[styles.ratingLabel, { color: COLORS_MAP[stars] }]}>
              {LABELS[stars]}
            </Text>
          )}

          {/* Tags */}
          <Text style={styles.sectionLabel}>ما أعجبك؟ (اختياري)</Text>
          <View style={styles.tagsWrap}>
            {RATING_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selected ? colors.primary : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, { color: selected ? "#FFF" : colors.foreground }]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Comment */}
          <Text style={styles.sectionLabel}>تعليق إضافي (اختياري)</Text>
          <TextInput
            style={styles.commentBox}
            placeholder="شاركنا تجربتك بمزيد من التفاصيل..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            value={comment}
            onChangeText={setComment}
            maxLength={300}
          />

          {/* Submit */}
          <Pressable style={styles.submitBtn} onPress={submit}>
            <LinearGradient
              colors={["#059669", "#10B981"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
            />
            <Text style={styles.submitText}>إرسال التقييم</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
