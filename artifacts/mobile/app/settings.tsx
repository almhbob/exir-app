import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const APP_VERSION = "1.0.0";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, userRole, logout } = useApp();

  const [notifBooking, setNotifBooking] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifReminder, setNotifReminder] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  async function handleLogout() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
    router.replace("/login");
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 14,
      paddingHorizontal: 20,
      paddingBottom: 28,
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
      alignSelf: "flex-end", marginBottom: 14,
    },
    title: {
      fontSize: 24, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
      textAlign: "right",
    },

    // Profile card in header
    profileCard: {
      flexDirection: "row", alignItems: "center",
      gap: 14, marginTop: 18,
      backgroundColor: "rgba(255,255,255,0.12)",
      borderRadius: 18, padding: 14,
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    },
    profileAvatar: {
      width: 54, height: 54, borderRadius: 27,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
      alignItems: "center", justifyContent: "center",
    },
    avatarText: {
      fontSize: 20, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
    },
    profileInfo: { flex: 1 },
    profileName: {
      fontSize: 16, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold", textAlign: "right",
    },
    profilePhone: {
      fontSize: 13, color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular", textAlign: "right",
    },
    roleBadge: {
      paddingHorizontal: 10, paddingVertical: 4,
      backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 100,
    },
    roleText: {
      fontSize: 11, color: "#FFF",
      fontFamily: "Inter_600SemiBold",
    },

    // Sections
    scrollContent: { padding: 16, paddingBottom: 60 },
    groupTitle: {
      fontSize: 12, color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textAlign: "right", marginBottom: 8, marginTop: 20,
      textTransform: "uppercase", letterSpacing: 0.8,
      paddingHorizontal: 4,
    },
    group: {
      backgroundColor: colors.card,
      borderRadius: 18,
      overflow: "hidden",
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 12,
    },
    rowLast: { borderBottomWidth: 0 },
    rowIcon: {
      width: 38, height: 38, borderRadius: 11,
      alignItems: "center", justifyContent: "center",
    },
    rowLabel: {
      flex: 1, fontSize: 15,
      color: colors.foreground, fontFamily: "Inter_500Medium",
      textAlign: "right",
    },
    rowSub: {
      fontSize: 12, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "right",
    },
    rowValue: {
      fontSize: 13, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },

    // Logout
    logoutBtn: {
      backgroundColor: "#FEF2F2", borderRadius: 18,
      marginTop: 20,
      overflow: "hidden",
    },
    logoutRow: {
      flexDirection: "row", alignItems: "center",
      padding: 18, gap: 12,
    },
    logoutIcon: {
      width: 38, height: 38, borderRadius: 11,
      backgroundColor: "#FEE2E2",
      alignItems: "center", justifyContent: "center",
    },
    logoutText: {
      flex: 1, fontSize: 15, fontWeight: "700",
      color: "#DC2626", fontFamily: "Inter_700Bold", textAlign: "right",
    },

    // Version
    version: {
      textAlign: "center", fontSize: 12,
      color: colors.mutedForeground, fontFamily: "Inter_400Regular",
      marginTop: 24, marginBottom: 8,
    },
    versionBold: { fontFamily: "Inter_700Bold", color: colors.primary },

    // Logout confirm overlay
    overlay: {
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      alignItems: "center", justifyContent: "center", padding: 32,
    },
    confirmBox: {
      backgroundColor: colors.card, borderRadius: 24,
      padding: 28, width: "100%",
    },
    confirmTitle: {
      fontSize: 20, fontWeight: "700",
      color: colors.foreground, fontFamily: "Inter_700Bold",
      textAlign: "center", marginBottom: 8,
    },
    confirmSub: {
      fontSize: 14, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "center",
      lineHeight: 22, marginBottom: 24,
    },
    confirmBtns: { flexDirection: "row", gap: 10 },
    confirmCancel: {
      flex: 1, paddingVertical: 14, alignItems: "center",
      borderRadius: 14, backgroundColor: colors.muted,
    },
    confirmCancelText: {
      fontSize: 15, fontFamily: "Inter_600SemiBold", color: colors.foreground,
    },
    confirmLogout: {
      flex: 1, paddingVertical: 14, alignItems: "center",
      borderRadius: 14, backgroundColor: "#DC2626",
    },
    confirmLogoutText: {
      fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFF",
    },
  });

  const initials = userProfile.name
    ? userProfile.name.split(" ").map((w) => w[0]).join("").slice(0, 2)
    : "؟";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#001629", "#003F6D", "#0A5FA0"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.orb1} pointerEvents="none" />
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.title}>الإعدادات</Text>

        <View style={styles.profileCard}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userRole === "doctor" ? "طبيب" : "مريض"}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name || "المستخدم"}</Text>
            <Text style={styles.profilePhone}>{userProfile.phone || "لم يُعيَّن"}</Text>
          </View>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Account */}
        <Text style={styles.groupTitle}>الحساب</Text>
        <View style={styles.group}>
          <Pressable
            style={styles.row}
            onPress={() => router.push(userRole === "doctor" ? "/(doctor)/profile" : "/(patient)/profile")}
          >
            <Feather name="chevron-left" size={18} color={colors.mutedForeground} />
            <Text style={styles.rowLabel}>تعديل الملف الشخصي</Text>
            <View style={[styles.rowIcon, { backgroundColor: "#EFF9FF" }]}>
              <Feather name="user" size={18} color={colors.primary} />
            </View>
          </Pressable>
          <Pressable style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowValue}>العربية</Text>
            <Text style={styles.rowLabel}>اللغة</Text>
            <View style={[styles.rowIcon, { backgroundColor: "#F5F3FF" }]}>
              <Feather name="globe" size={18} color="#7C3AED" />
            </View>
          </Pressable>
        </View>

        {/* Notifications */}
        <Text style={styles.groupTitle}>الإشعارات</Text>
        <View style={styles.group}>
          {[
            { label: "إشعارات الحجوزات", sub: "تأكيد وحالة الزيارة", val: notifBooking, set: setNotifBooking, color: "#EFF9FF", iconColor: colors.primary },
            { label: "التذكيرات", sub: "قبل الموعد بساعة", val: notifReminder, set: setNotifReminder, color: "#ECFDF5", iconColor: "#059669" },
            { label: "العروض والأخبار", sub: "تحديثات المنصة", val: notifPromo, set: setNotifPromo, color: "#FFFBEB", iconColor: "#D97706" },
          ].map((item, i, arr) => (
            <View key={item.label} style={[styles.row, i === arr.length - 1 && styles.rowLast]}>
              <Switch
                value={item.val}
                onValueChange={(v) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); item.set(v); }}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={item.val ? colors.primary : colors.mutedForeground}
              />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowSub}>{item.sub}</Text>
              </View>
              <View style={[styles.rowIcon, { backgroundColor: item.color }]}>
                <Feather name="bell" size={18} color={item.iconColor} />
              </View>
            </View>
          ))}
        </View>

        {/* Support */}
        <Text style={styles.groupTitle}>المساعدة</Text>
        <View style={styles.group}>
          {[
            { label: "مركز المساعدة", icon: "help-circle", color: "#EFF9FF", iconColor: colors.primary },
            { label: "سياسة الخصوصية", icon: "shield", color: "#ECFDF5", iconColor: "#059669" },
            { label: "شروط الاستخدام", icon: "file-text", color: "#F5F3FF", iconColor: "#7C3AED" },
          ].map((item, i, arr) => (
            <Pressable
              key={item.label}
              style={[styles.row, i === arr.length - 1 && styles.rowLast]}
              onPress={() => Alert.alert(item.label, "سيتم إضافة هذه الصفحة قريباً.")}
            >
              <Feather name="chevron-left" size={18} color={colors.mutedForeground} />
              <Text style={styles.rowLabel}>{item.label}</Text>
              <View style={[styles.rowIcon, { backgroundColor: item.color as string }]}>
                <Feather name={item.icon as any} size={18} color={item.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* About */}
        <Text style={styles.groupTitle}>عن التطبيق</Text>
        <View style={styles.group}>
          <View style={[styles.row, styles.rowLast]}>
            <Text style={styles.rowValue}>v{APP_VERSION}</Text>
            <Text style={styles.rowLabel}>اكسير — Elixir</Text>
            <View style={[styles.rowIcon, { backgroundColor: "#EFF9FF" }]}>
              <Text style={{ fontSize: 18 }}>💊</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)}>
          <View style={styles.logoutRow}>
            <Feather name="chevron-left" size={18} color="#DC2626" />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
            <View style={styles.logoutIcon}>
              <Feather name="log-out" size={18} color="#DC2626" />
            </View>
          </View>
        </Pressable>

        <Text style={styles.version}>
          <Text style={styles.versionBold}>اكسير</Text> — منصة الرعاية الصحية المنزلية · v{APP_VERSION}
        </Text>
      </ScrollView>

      {/* Logout Confirm */}
      {showLogoutModal && (
        <View style={styles.overlay}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>تسجيل الخروج</Text>
            <Text style={styles.confirmSub}>
              هل أنت متأكد من تسجيل الخروج؟{"\n"}ستحتاج إلى تسجيل الدخول مرة أخرى.
            </Text>
            <View style={styles.confirmBtns}>
              <Pressable style={styles.confirmLogout} onPress={handleLogout}>
                <Text style={styles.confirmLogoutText}>تسجيل الخروج</Text>
              </Pressable>
              <Pressable style={styles.confirmCancel} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.confirmCancelText}>إلغاء</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
