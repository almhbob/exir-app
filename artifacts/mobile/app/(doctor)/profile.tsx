import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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

const MOCK_STATS = {
  totalVisits: 312,
  rating: 4.8,
  reviewCount: 203,
  experience: 8,
};

export default function DoctorProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, setUserProfile, setUserRole } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile.name || "");
  const [phone, setPhone] = useState(userProfile.phone || "");
  const [specialty, setSpecialty] = useState(userProfile.specialty || "");
  const [experience, setExperience] = useState(userProfile.experience || "");
  const [license, setLicense] = useState(userProfile.licenseNumber || "");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").substring(0, 2)
    : "ط";

  async function saveProfile() {
    await setUserProfile({ name, phone, specialty, experience, licenseNumber: license });
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function handleLogout() {
    Alert.alert("تسجيل الخروج", "هل تريد تسجيل الخروج وتغيير نوع الحساب؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "خروج",
        style: "destructive",
        onPress: async () => {
          await setUserRole(null);
          router.replace("/onboarding");
        },
      },
    ]);
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 28,
      backgroundColor: colors.primary,
      alignItems: "center",
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      borderWidth: 3,
      borderColor: "rgba(255,255,255,0.4)",
    },
    avatarText: {
      fontSize: 34,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },
    docName: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    docSpec: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      fontFamily: "Inter_500Medium",
      marginBottom: 4,
    },
    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 100,
    },
    verifiedText: {
      fontSize: 12,
      color: "#FFF",
      fontFamily: "Inter_600SemiBold",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 0,
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      marginTop: -1,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    stat: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 16,
      borderRightWidth: 1,
      borderRightColor: colors.border,
    },
    statLast: { borderRightWidth: 0 },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    statLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    section: { marginHorizontal: 20, marginTop: 20 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 12,
      textAlign: "right",
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    infoRowLast: { borderBottomWidth: 0 },
    infoIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },
    infoContent: { flex: 1, alignItems: "flex-end" },
    infoLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
    },
    input: {
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      borderBottomWidth: 1,
      borderColor: colors.primary,
      paddingBottom: 2,
    },
    editBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
    },
    editBtnText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    saveBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: colors.radius,
    },
    saveBtnText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_700Bold",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    menuItemIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    menuItemText: {
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      flex: 1,
      textAlign: "right",
    },
    logoutBtn: {
      marginHorizontal: 20,
      marginTop: 8,
      backgroundColor: colors.destructiveLight,
      borderRadius: colors.radius,
      padding: 14,
      alignItems: "center",
      marginBottom: bottomPad + 100,
    },
    logoutText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.destructive,
      fontFamily: "Inter_700Bold",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.docName}>
            {name ? `د. ${name}` : "الطبيب"}
          </Text>
          {specialty ? (
            <Text style={styles.docSpec}>{specialty}</Text>
          ) : null}
          <View style={styles.verifiedBadge}>
            <Feather name="shield" size={12} color="#FFF" />
            <Text style={styles.verifiedText}>موثق على المنصة</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { value: MOCK_STATS.totalVisits, label: "زيارة منجزة" },
            { value: `${MOCK_STATS.rating}★`, label: "التقييم" },
            { value: MOCK_STATS.experience, label: "سنة خبرة" },
          ].map((s, i) => (
            <View key={i} style={[styles.stat, i === 2 && styles.statLast]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            {editing ? (
              <Pressable style={styles.saveBtn} onPress={saveProfile}>
                <Text style={styles.saveBtnText}>حفظ</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.editBtn} onPress={() => setEditing(true)}>
                <Text style={styles.editBtnText}>تعديل</Text>
                <Feather name="edit-2" size={13} color={colors.primary} />
              </Pressable>
            )}
            <Text style={styles.sectionTitle}>البيانات المهنية</Text>
          </View>
          <View style={styles.infoCard}>
            {[
              { label: "الاسم", value: name, setter: setName, icon: "user" },
              { label: "الجوال", value: phone, setter: setPhone, icon: "phone" },
              { label: "التخصص", value: specialty, setter: setSpecialty, icon: "activity" },
              { label: "سنوات الخبرة", value: experience, setter: setExperience, icon: "award" },
              { label: "رقم الترخيص", value: license, setter: setLicense, icon: "file-text" },
            ].map((item, idx, arr) => (
              <View
                key={item.label}
                style={[styles.infoRow, idx === arr.length - 1 && styles.infoRowLast]}
              >
                <View style={styles.infoIcon}>
                  <Feather name={item.icon as any} size={16} color={colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  {editing ? (
                    <TextInput
                      style={styles.input}
                      value={item.value}
                      onChangeText={item.setter}
                    />
                  ) : (
                    <Text style={styles.infoValue}>{item.value || "—"}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إدارة الحساب</Text>
          {[
            { icon: "star", label: "تقييماتي ومراجعات المرضى", color: "#D97706" },
            { icon: "file-text", label: "الوثائق والشهادات", color: "#7C3AED" },
            { icon: "credit-card", label: "بيانات الدفع والمصرف", color: "#059669" },
            { icon: "shield", label: "الأمان والخصوصية", color: "#0D7C8C" },
            { icon: "headphones", label: "الدعم الفني", color: "#64748B" },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Feather name="chevron-left" size={18} color={colors.mutedForeground} />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <View style={[styles.menuItemIcon, { backgroundColor: item.color + "20" }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
