import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const QUICK_SERVICES = [
  { id: "qs1", label: "طوارئ منزلية", icon: "alert-circle", color: "#DC2626", bg: "#FEE2E2" },
  { id: "qs2", label: "تحاليل منزلية", icon: "droplet", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "qs3", label: "توصيل دواء", icon: "package", color: "#059669", bg: "#D1FAE5" },
  { id: "qs4", label: "تمريض منزلي", icon: "activity", color: "#D97706", bg: "#FEF3C7" },
];

export default function PatientHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, doctors, specialties, bookings } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const activeBooking = bookings.find(
    (b) => b.status === "active" || b.status === "confirmed"
  );
  const availableDoctors = doctors.filter((d) => d.available);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 16,
      paddingHorizontal: 20,
      paddingBottom: 28,
      overflow: "hidden",
    },
    orb1: {
      position: "absolute",
      top: -50,
      right: -60,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: "rgba(37,156,244,0.22)",
    },
    orb2: {
      position: "absolute",
      bottom: -30,
      left: -40,
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: "rgba(29,208,248,0.14)",
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    greeting: {
      fontSize: 13,
      color: "rgba(255,255,255,0.72)",
      fontFamily: "Inter_400Regular",
    },
    userName: {
      fontSize: 21,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.3,
    },
    notifBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.25)",
      alignItems: "center",
      justifyContent: "center",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.93)",
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 13,
      gap: 10,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.5)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    searchText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    seeAll: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    quickGrid: {
      flexDirection: "row",
      gap: 10,
    },
    quickCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 14,
      alignItems: "center",
      gap: 8,
      shadowColor: "#259CF4",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.09,
      shadowRadius: 10,
      elevation: 3,
    },
    quickIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    quickLabel: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      textAlign: "center",
    },
    specialtyRow: {
      gap: 8,
    },
    specialtyChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 100,
      borderWidth: 1.5,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    specialtyText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    doctorCard: {
      width: 184,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 6,
      padding: 16,
      marginRight: 12,
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 14,
      elevation: 5,
    },
    doctorAvatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.primary + "25",
    },
    doctorAvatarText: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    doctorName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
    },
    doctorSpec: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 8,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 10,
    },
    ratingText: {
      fontSize: 12,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    reviewText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    availBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.mintLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 100,
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    availDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.mint,
    },
    availText: {
      fontSize: 11,
      color: "#047857",
      fontFamily: "Inter_600SemiBold",
    },
    bookBtn: {
      borderRadius: colors.radius - 2,
      paddingVertical: 8,
      alignItems: "center",
      overflow: "hidden",
    },
    bookBtnText: {
      color: "#FFF",
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    activeBanner: {
      margin: 16,
      marginBottom: 0,
      borderRadius: colors.radius + 4,
      overflow: "hidden",
    },
    activeBannerInner: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    activeBannerIcon: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    activeBannerTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
    },
    activeBannerSub: {
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_400Regular",
    },
    activeBannerArrow: {
      marginLeft: "auto",
    },
    space: { height: 110 },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Gradient Header ── */}
        <LinearGradient
          colors={["#001E3C", "#003F6D", "#0A5FA0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.orb1} pointerEvents="none" />
          <View style={styles.orb2} pointerEvents="none" />

          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>مرحباً،</Text>
              <Text style={styles.userName}>
                {userProfile.name || "مريض"}
              </Text>
            </View>
            <Pressable style={styles.notifBtn}>
              <Feather name="bell" size={20} color="#FFF" />
            </Pressable>
          </View>

          <Pressable
            style={styles.searchBar}
            onPress={() => router.push("/(patient)/doctors")}
          >
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <Text style={styles.searchText}>ابحث عن طبيب أو تخصص...</Text>
          </Pressable>
        </LinearGradient>

        {/* ── Active booking banner ── */}
        {activeBooking && (
          <Pressable style={styles.activeBanner}>
            <LinearGradient
              colors={["#259CF4", "#1DD0F8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.activeBannerInner}>
              <View style={styles.activeBannerIcon}>
                <Feather name="navigation" size={22} color="#FFF" />
              </View>
              <View>
                <Text style={styles.activeBannerTitle}>زيارة جارية</Text>
                <Text style={styles.activeBannerSub}>
                  {activeBooking.doctorName} — {activeBooking.specialty}
                </Text>
              </View>
              <Feather
                name="chevron-left"
                size={20}
                color="#FFF"
                style={styles.activeBannerArrow}
              />
            </View>
          </Pressable>
        )}

        {/* ── Quick Services ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { marginBottom: 14 }]}>
            خدمات سريعة
          </Text>
          <View style={styles.quickGrid}>
            {QUICK_SERVICES.map((s) => (
              <Pressable
                key={s.id}
                style={styles.quickCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(patient)/doctors");
                }}
              >
                <View style={[styles.quickIcon, { backgroundColor: s.bg }]}>
                  <Feather name={s.icon as any} size={22} color={s.color} />
                </View>
                <Text style={styles.quickLabel}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Specialties ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pressable onPress={() => router.push("/(patient)/doctors")}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>التخصصات</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtyRow}
          >
            {specialties.map((sp) => (
              <Pressable
                key={sp.id}
                style={[
                  styles.specialtyChip,
                  {
                    backgroundColor: colors.accentLight,
                    borderColor: colors.accent + "50",
                  },
                ]}
                onPress={() => router.push("/(patient)/doctors")}
              >
                <Text style={[styles.specialtyText, { color: colors.dark }]}>
                  {sp.name}
                </Text>
                <Text
                  style={[
                    styles.specialtyText,
                    { color: colors.mutedForeground, fontSize: 11 },
                  ]}
                >
                  ({sp.count})
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Available Doctors ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Pressable onPress={() => router.push("/(patient)/doctors")}>
              <Text style={styles.seeAll}>عرض الكل</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>أطباء متاحون الآن</Text>
          </View>
          <FlatList
            data={availableDoctors}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.doctorCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(patient)/doctors");
                }}
              >
                <View style={styles.doctorAvatar}>
                  <Text style={styles.doctorAvatarText}>{item.avatar}</Text>
                </View>
                <Text style={styles.doctorName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.doctorSpec}>{item.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Feather name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.reviewText}>({item.reviewCount})</Text>
                </View>
                <View style={styles.availBadge}>
                  <View style={styles.availDot} />
                  <Text style={styles.availText}>متاح الآن</Text>
                </View>
                <Pressable style={styles.bookBtn} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push("/(patient)/doctors");
                }}>
                  <LinearGradient
                    colors={["#003F6D", "#0A5FA0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: colors.radius - 2 }]}
                  />
                  <Text style={styles.bookBtnText}>احجز زيارة</Text>
                </Pressable>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.space} />
      </ScrollView>
    </View>
  );
}
