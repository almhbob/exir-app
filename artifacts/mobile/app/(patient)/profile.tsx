import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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
import { uploadToCloudinary, getAvatarUrl } from "@/lib/cloudinary";

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
  const [avatarUploading, setAvatarUploading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const completedBookings = bookings.filter((b) => b.status === "completed").length;

  async function saveProfile() {
    await setUserProfile({ name, phone, address, age, bloodType });
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  async function handleAvatarUpload() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      setAvatarUploading(true);
      const uploaded = await uploadToCloudinary(result.assets[0].uri, "akseer/avatars");
      await setUserProfile({ avatarUrl: uploaded.secureUrl, avatarPublicId: uploaded.publicId });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert("خطأ", "تعذّر رفع الصورة، حاول مجدداً.");
    } finally {
      setAvatarUploading(false);
    }
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
      paddingBottom: 28,
      alignItems: "center",
      overflow: "hidden",
    },
    headerOrb1: {
      position: "absolute",
      top: -60,
      right: -60,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(37,156,244,0.2)",
    },
    headerOrb2: {
      position: "absolute",
      bottom: -20,
      left: -40,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "rgba(29,208,248,0.14)",
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
      overflow: "hidden",
    },
    avatarCamBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.dark,
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
      paddingVertical: 18,
      marginHorizontal: 20,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 6,
      marginTop: -20,
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
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
      overflow: "hidden",
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 3,
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
      borderRadius: colors.radius + 2,
      padding: 15,
      marginBottom: 10,
      gap: 12,
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
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
        <LinearGradient
          colors={["#001E3C", "#003F6D", "#0A5FA0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerOrb1} pointerEvents="none" />
          <View style={styles.headerOrb2} pointerEvents="none" />
          <Pressable onPress={handleAvatarUpload} disabled={avatarUploading}>
            <View style={styles.avatar}>
              {userProfile.avatarUrl ? (
                <Image
                  source={{ uri: userProfile.avatarUrl }}
                  style={{ width: 88, height: 88, borderRadius: 44 }}
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View style={styles.avatarCamBtn}>
              {avatarUploading ? (
                <Feather name="loader" size={12} color="#FFF" />
              ) : (
                <Feather name="camera" size={12} color="#FFF" />
              )}
            </View>
          </Pressable>
          <Text style={styles.userName}>{userProfile.name || "المريض"}</Text>
          <Text style={styles.userPhone}>{userProfile.phone || "رقم الجوال"}</Text>
        </LinearGradient>

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
            { icon: "file-text", label: "سجلاتي الطبية", color: "#7C3AED", route: "/(patient)/records" },
            { icon: "package", label: "طلبات الدواء", color: "#059669" },
            { icon: "star", label: "تقييماتي", color: "#D97706" },
            { icon: "headphones", label: "الدعم والمساعدة", color: "#259CF4" },
          ].map((item) => (
            <Pressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if ("route" in item && item.route) router.push(item.route as any);
              }}
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
