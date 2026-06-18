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

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientProfile() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, setUserProfile, setUserRole, bookings } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [age, setAge] = useState(userProfile.age);
  const [bloodType, setBloodType] = useState(userProfile.bloodType);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  async function saveProfile() {
    await setUserProfile({ name, phone, address, age, bloodType });
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
    scroll: { flex: 1 },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 24,
      backgroundColor: colors.primary,
      alignItems: "center",
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },
    userName: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    userPhone: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_400Regular",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 32,
      paddingVertical: 16,
      marginHorizontal: 16,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      marginTop: -1,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 20,
    },
    stat: { alignItems: "center" },
    statValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
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
    infoRowLast: {
      borderBottomWidth: 0,
    },
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
    bloodRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      justifyContent: "flex-end",
    },
    bloodChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    bloodChipText: {
      fontSize: 13,
      fontFamily: "Inter_700Bold",
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
    headerRight: {
      position: "absolute",
      top: topPad + 12,
      right: 20,
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

  const initials = userProfile.name
    ? userProfile.name.split(" ").map((n) => n[0]).join("").substring(0, 2)
    : "م";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{userProfile.name || "المريض"}</Text>
          <Text style={styles.userPhone}>{userProfile.phone || "رقم الجوال"}</Text>
        </View>

        <View style={[styles.statsRow]}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>إجمالي الحجوزات</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{completedBookings}</Text>
            <Text style={styles.statLabel}>زيارة مكتملة</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {bookings.reduce((s, b) => s + b.price, 0)}
            </Text>
            <Text style={styles.statLabel}>ر.س إجمالي</Text>
          </View>
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
            <Text style={styles.sectionTitle}>البيانات الشخصية</Text>
          </View>
          <View style={styles.infoCard}>
            {[
              { label: "الاسم", value: name, setter: setName, icon: "user" },
              { label: "الجوال", value: phone, setter: setPhone, icon: "phone" },
              { label: "العنوان", value: address, setter: setAddress, icon: "map-pin" },
              { label: "العمر", value: age, setter: setAge, icon: "calendar" },
            ].map((item, idx, arr) => (
              <View
                key={item.label}
                style={[
                  styles.infoRow,
                  idx === arr.length - 1 && styles.infoRowLast,
                ]}
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
                    <Text style={styles.infoValue}>
                      {item.value || "—"}
                    </Text>
                  )}
                </View>
              </View>
            ))}
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <View style={styles.infoIcon}>
                <Feather name="droplet" size={16} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>فصيلة الدم</Text>
                {editing ? (
                  <View style={styles.bloodRow}>
                    {BLOOD_TYPES.map((bt) => (
                      <Pressable
                        key={bt}
                        style={[
                          styles.bloodChip,
                          {
                            backgroundColor:
                              bloodType === bt ? colors.primary : colors.muted,
                            borderColor:
                              bloodType === bt ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => setBloodType(bt)}
                      >
                        <Text
                          style={[
                            styles.bloodChipText,
                            { color: bloodType === bt ? "#FFF" : colors.foreground },
                          ]}
                        >
                          {bt}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.infoValue}>{bloodType}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخدمات</Text>
          {[
            { icon: "file-text", label: "سجلاتي الطبية", color: "#7C3AED" },
            { icon: "package", label: "طلبات الدواء", color: "#059669" },
            { icon: "star", label: "تقييماتي", color: "#D97706" },
            { icon: "headphones", label: "الدعم والمساعدة", color: "#0D7C8C" },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Feather name="chevron-left" size={18} color={colors.mutedForeground} />
              <Text style={styles.menuItemText}>{item.label}</Text>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: item.color + "20" },
                ]}
              >
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
