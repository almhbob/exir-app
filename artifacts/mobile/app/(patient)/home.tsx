import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
  { id: "qs1", label: "طوارئ", icon: "alert-circle", color: "#EF4444", bg: "#FEF2F2" },
  { id: "qs2", label: "تحاليل", icon: "droplet", color: "#7C3AED", bg: "#F5F3FF" },
  { id: "qs3", label: "دواء", icon: "package", color: "#059669", bg: "#ECFDF5" },
  { id: "qs4", label: "تمريض", icon: "activity", color: "#D97706", bg: "#FFFBEB" },
];

export default function PatientHome() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile, doctors, specialties, bookings } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const activeBooking = bookings.find(
    (b) => b.status === "active" || b.status === "confirmed"
  );
  const availableDoctors = doctors.filter((d) => d.available);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // ── Header ──
    header: {
      paddingTop: topPad + 14,
      paddingHorizontal: 22,
      paddingBottom: 30,
      overflow: "hidden",
    },
    orb1: {
      position: "absolute", top: -60, right: -60,
      width: 200, height: 200, borderRadius: 100,
      backgroundColor: "rgba(37,156,244,0.25)",
    },
    orb2: {
      position: "absolute", bottom: -40, left: -50,
      width: 160, height: 160, borderRadius: 80,
      backgroundColor: "rgba(29,208,248,0.15)",
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 22,
    },
    greetLabel: {
      fontSize: 13,
      color: "rgba(255,255,255,0.65)",
      fontFamily: "Inter_400Regular",
      marginBottom: 2,
    },
    userName: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.5,
    },
    notifBtn: {
      width: 44, height: 44, borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.94)",
      borderRadius: 100,
      paddingHorizontal: 18,
      paddingVertical: 14,
      gap: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 4,
    },
    searchText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },

    // ── Online card ──
    onlineCard: {
      margin: 16,
      marginBottom: 0,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: "#4C1D95",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 18,
      elevation: 8,
    },
    onlineInner: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    onlineIcon: {
      width: 52, height: 52, borderRadius: 26,
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.3)",
      alignItems: "center",
      justifyContent: "center",
    },
    onlineTitle: {
      fontSize: 16, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
      marginBottom: 3,
    },
    onlineSub: {
      fontSize: 12,
      color: "rgba(255,255,255,0.78)",
      fontFamily: "Inter_400Regular",
    },
    onlineBadge: {
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "rgba(255,255,255,0.15)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 100,
    },
    onlineDot: {
      width: 7, height: 7, borderRadius: 4,
      backgroundColor: "#4ADE80",
    },
    onlineBadgeText: {
      fontSize: 12,
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },

    // ── Active booking banner ──
    activeBanner: {
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 18,
      overflow: "hidden",
    },
    activeBannerInner: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    activeBannerIcon: {
      width: 46, height: 46, borderRadius: 23,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    activeBannerTitle: {
      fontSize: 14, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold", marginBottom: 2,
    },
    activeBannerSub: {
      fontSize: 12,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_400Regular",
    },
    activeBannerArrow: { marginLeft: "auto" },

    // ── Section ──
    section: { paddingHorizontal: 18, marginTop: 26 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 18, fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.3,
    },
    seeAll: {
      fontSize: 13, color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },

    // ── Quick services ──
    quickGrid: { flexDirection: "row", gap: 10 },
    quickCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 8,
      alignItems: "center",
      gap: 8,
      shadowColor: "#0E4D62",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    quickIcon: {
      width: 46, height: 46, borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    quickLabel: {
      fontSize: 11,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
    },

    // ── Specialties ──
    specRow: { gap: 8 },
    specChip: {
      paddingHorizontal: 16, paddingVertical: 10,
      borderRadius: 100, borderWidth: 1.5,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    specText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

    // ── Doctor cards ──
    doctorCard: {
      width: 188,
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: 16,
      marginRight: 12,
      shadowColor: "#0E4D62",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
    },
    doctorAvatar: {
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      borderWidth: 2,
      borderColor: colors.primary + "20",
    },
    doctorAvatarText: {
      fontSize: 17, fontWeight: "700",
      color: colors.primary, fontFamily: "Inter_700Bold",
    },
    doctorName: {
      fontSize: 14, fontWeight: "700",
      color: colors.foreground, fontFamily: "Inter_700Bold", marginBottom: 2,
    },
    doctorSpec: {
      fontSize: 12, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", marginBottom: 8,
    },
    ratingRow: {
      flexDirection: "row", alignItems: "center",
      gap: 4, marginBottom: 10,
    },
    ratingText: {
      fontSize: 12, fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    reviewText: {
      fontSize: 11, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    availBadge: {
      flexDirection: "row", alignItems: "center",
      gap: 5, backgroundColor: "#DCFCE7",
      paddingHorizontal: 8, paddingVertical: 4,
      borderRadius: 100, alignSelf: "flex-start", marginBottom: 10,
    },
    availDot: {
      width: 6, height: 6, borderRadius: 3,
      backgroundColor: "#16A34A",
    },
    availText: {
      fontSize: 11, color: "#15803D",
      fontFamily: "Inter_700Bold",
    },
    bookBtn: {
      borderRadius: 12, paddingVertical: 9,
      alignItems: "center", overflow: "hidden",
    },
    bookBtnText: {
      color: "#FFF", fontSize: 12, fontFamily: "Inter_700Bold",
    },

    space: { height: 110 },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Gradient Header ── */}
        <LinearGradient
          colors={["#051C2C", "#0E4D62", "#1A7066"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.orb1} pointerEvents="none" />
          <View style={styles.orb2} pointerEvents="none" />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetLabel}>مرحباً 👋</Text>
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
            <View
              style={{
                backgroundColor: colors.primary,
                borderRadius: 10,
                padding: 6,
              }}
            >
              <Feather name="sliders" size={14} color="#FFF" />
            </View>
          </Pressable>
        </LinearGradient>

        {/* ── Online Consultation Card ── */}
        <Pressable
          style={styles.onlineCard}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(patient)/online");
          }}
        >
          <LinearGradient
            colors={["#2D0A6B", "#4C1D95", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.onlineInner}>
            <View style={styles.onlineIcon}>
              <Feather name="video" size={24} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.onlineTitle}>استشارة أونلاين</Text>
              <Text style={styles.onlineSub}>
                أطباء عالميون — من أي مكان في العالم
              </Text>
            </View>
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineBadgeText}>مباشر</Text>
            </View>
          </View>
        </Pressable>

        {/* ── Active booking banner ── */}
        {activeBooking && (
          <Pressable style={styles.activeBanner}>
            <LinearGradient
              colors={["#1E8070", "#48B86A"]}
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
            contentContainerStyle={styles.specRow}
          >
            {specialties.map((sp) => (
              <Pressable
                key={sp.id}
                style={[
                  styles.specChip,
                  {
                    backgroundColor: colors.accentLight,
                    borderColor: colors.accent + "50",
                  },
                ]}
                onPress={() => router.push("/(patient)/doctors")}
              >
                <Text style={[styles.specText, { color: colors.dark }]}>
                  {sp.name}
                </Text>
                <Text
                  style={[
                    styles.specText,
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
                  router.push({ pathname: "/doctor/[id]", params: { id: item.id } });
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
                <Pressable
                  style={styles.bookBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push("/(patient)/doctors");
                  }}
                >
                  <LinearGradient
                    colors={["#0E4D62", "#1A7066"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
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
