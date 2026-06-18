import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, Booking } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MOCK_REVIEWS = [
  { id: "r1", name: "م. خالد", stars: 5, comment: "طبيب ممتاز، سريع ودقيق في التشخيص. أنصح به بشدة.", date: "منذ يومين" },
  { id: "r2", name: "أ. فاطمة", stars: 5, comment: "تجربة رائعة، تعامل محترف جداً مع طفلي. شكراً جزيلاً.", date: "منذ 5 أيام" },
  { id: "r3", name: "م. عبدالرحمن", stars: 4, comment: "خدمة جيدة وسريعة، وصل في الوقت المحدد تماماً.", date: "منذ أسبوع" },
  { id: "r4", name: "أ. نوف", stars: 5, comment: "احترافية عالية ومعرفة طبية ممتازة. سأحجز مرة أخرى.", date: "منذ 10 أيام" },
];

const TIME_SLOTS = [
  "09:00 ص", "10:00 ص", "11:00 ص", "01:00 م",
  "02:00 م", "03:00 م", "05:00 م", "07:00 م",
];

type Tab = "info" | "reviews" | "slots";

export default function DoctorDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { doctors, addBooking, userProfile } = useApp();

  const doctor = doctors.find((d) => d.id === id);
  const [tab, setTab] = useState<Tab>("info");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  if (!doctor) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>الطبيب غير موجود</Text>
      </View>
    );
  }

  function confirmBooking() {
    if (!selectedSlot) {
      Alert.alert("تنبيه", "اختر موعداً أولاً");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const booking: Booking = {
      id: `b${Date.now()}`,
      doctorId: doctor!.id,
      doctorName: doctor!.name,
      specialty: doctor!.specialty,
      date: "اليوم",
      time: selectedSlot,
      status: "pending",
      address: userProfile.address || "الرياض",
      notes: "",
      price: doctor!.price,
      type: "home",
    };
    addBooking(booking);
    setShowBooking(false);
    Alert.alert(
      "تم الحجز ✓",
      `تم حجز موعدك مع ${doctor!.name} الساعة ${selectedSlot}`,
      [{ text: "عرض الحجوزات", onPress: () => router.push("/(patient)/bookings") }, { text: "حسناً" }]
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad,
      paddingBottom: 28,
      overflow: "hidden",
    },
    orb1: {
      position: "absolute", top: -60, right: -60,
      width: 200, height: 200, borderRadius: 100,
      backgroundColor: "rgba(37,156,244,0.22)",
    },
    orb2: {
      position: "absolute", bottom: -30, left: -40,
      width: 140, height: 140, borderRadius: 70,
      backgroundColor: "rgba(92,234,210,0.15)",
    },
    backBtn: {
      margin: 16, marginBottom: 8,
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
      alignItems: "center", justifyContent: "center",
      alignSelf: "flex-end",
    },
    heroRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      gap: 16,
    },
    avatar: {
      width: 76, height: 76, borderRadius: 38,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
      alignItems: "center", justifyContent: "center",
    },
    avatarText: {
      fontSize: 24, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
    },
    heroInfo: { flex: 1 },
    doctorName: {
      fontSize: 20, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
      textAlign: "right", marginBottom: 3,
    },
    doctorSpec: {
      fontSize: 14, color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_600SemiBold", textAlign: "right", marginBottom: 8,
    },
    ratingRow: {
      flexDirection: "row", alignItems: "center",
      gap: 5, justifyContent: "flex-end",
    },
    ratingText: {
      fontSize: 14, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
    },
    reviewCount: {
      fontSize: 12, color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular",
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 8,
      marginTop: 16,
    },
    stat: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderRadius: 14,
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
      padding: 12,
      alignItems: "center", gap: 4,
    },
    statValue: {
      fontSize: 17, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
    },
    statLabel: {
      fontSize: 11, color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular",
    },
    availBadge: {
      flexDirection: "row", alignItems: "center",
      gap: 5, backgroundColor: "#DCFCE7",
      paddingHorizontal: 10, paddingVertical: 5,
      borderRadius: 100, alignSelf: "flex-end",
      marginHorizontal: 20, marginTop: 12,
    },
    availDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#16A34A" },
    availText: { fontSize: 12, color: "#15803D", fontFamily: "Inter_700Bold" },
    notAvailBadge: {
      backgroundColor: "#FEE2E2",
    },
    notAvailText: { color: "#DC2626" },

    // Tabs
    tabRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 6,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabBtn: {
      flex: 1, paddingVertical: 10,
      borderRadius: 100, alignItems: "center",
      borderWidth: 1.5,
    },
    tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

    // Content
    content: { padding: 20, paddingBottom: 120 },

    sectionTitle: {
      fontSize: 16, fontWeight: "700",
      color: colors.foreground, fontFamily: "Inter_700Bold",
      textAlign: "right", marginBottom: 10, marginTop: 20,
    },
    bioText: {
      fontSize: 14, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "right",
      lineHeight: 22,
    },
    langRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-end", marginTop: 8 },
    langChip: {
      paddingHorizontal: 12, paddingVertical: 6,
      backgroundColor: colors.accentLight, borderRadius: 100,
    },
    langText: { fontSize: 12, color: colors.dark, fontFamily: "Inter_600SemiBold" },
    certRow: { gap: 8 },
    certItem: {
      flexDirection: "row", alignItems: "center",
      gap: 8, justifyContent: "flex-end",
      backgroundColor: colors.card, borderRadius: 12,
      padding: 12,
    },
    certText: { fontSize: 13, color: colors.foreground, fontFamily: "Inter_500Medium" },

    // Reviews
    reviewCard: {
      backgroundColor: colors.card, borderRadius: 16,
      padding: 16, marginBottom: 10,
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    },
    reviewTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    reviewName: { fontSize: 14, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" },
    reviewDate: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    starsRow: { flexDirection: "row", gap: 2, justifyContent: "flex-end", marginBottom: 8 },
    reviewText: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "right", lineHeight: 20 },

    // Slots
    slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "flex-end" },
    slotBtn: {
      paddingHorizontal: 16, paddingVertical: 12,
      borderRadius: 12, borderWidth: 1.5,
    },
    slotText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

    // Bottom bar
    bottomBar: {
      position: "absolute", bottom: 0, left: 0, right: 0,
      backgroundColor: colors.card,
      borderTopWidth: 1, borderTopColor: colors.border,
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 12,
      paddingTop: 12,
      flexDirection: "row", alignItems: "center", gap: 12,
    },
    priceWrap: { alignItems: "flex-end" },
    priceLabel: { fontSize: 11, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    price: { fontSize: 22, fontWeight: "700", color: colors.foreground, fontFamily: "Inter_700Bold" },
    priceUnit: { fontSize: 13, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    bookBtn: {
      flex: 1, borderRadius: 16,
      paddingVertical: 16, alignItems: "center",
      overflow: "hidden",
    },
    bookBtnText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
    chatBtn: {
      width: 50, height: 50, borderRadius: 16,
      backgroundColor: colors.accentLight,
      alignItems: "center", justifyContent: "center",
      borderWidth: 1.5, borderColor: colors.accent + "40",
    },
  });

  return (
    <View style={styles.container}>
      {/* Hero */}
      <LinearGradient
        colors={["#001629", "#003F6D", "#0A5FA0"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.orb1} pointerEvents="none" />
        <View style={styles.orb2} pointerEvents="none" />

        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-right" size={20} color="#FFF" />
        </Pressable>

        <View style={styles.heroRow}>
          <View style={styles.heroInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpec}>{doctor.specialty} · {doctor.specialtyEn}</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.reviewCount}>({doctor.reviewCount} تقييم)</Text>
              <Text style={styles.ratingText}>{doctor.rating}</Text>
              <Feather name="star" size={14} color="#F59E0B" />
            </View>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{doctor.avatar}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{doctor.experience}</Text>
            <Text style={styles.statLabel}>سنة خبرة</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{doctor.reviewCount}</Text>
            <Text style={styles.statLabel}>مريض</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{doctor.distance}</Text>
            <Text style={styles.statLabel}>بُعد</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{doctor.price}</Text>
            <Text style={styles.statLabel}>ر.س</Text>
          </View>
        </View>

        <View style={[styles.availBadge, !doctor.available && styles.notAvailBadge]}>
          <View style={[styles.availDot, !doctor.available && { backgroundColor: "#DC2626" }]} />
          <Text style={[styles.availText, !doctor.available && styles.notAvailText]}>
            {doctor.available ? "متاح الآن" : "غير متاح حالياً"}
          </Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {([
          { id: "info" as Tab, label: "المعلومات" },
          { id: "reviews" as Tab, label: "التقييمات" },
          { id: "slots" as Tab, label: "المواعيد" },
        ] as { id: Tab; label: string }[]).map((t) => (
          <Pressable
            key={t.id}
            style={[
              styles.tabBtn,
              {
                backgroundColor: tab === t.id ? colors.primary : "transparent",
                borderColor: tab === t.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(t.id); }}
          >
            <Text style={[styles.tabText, { color: tab === t.id ? "#FFF" : colors.mutedForeground }]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {tab === "info" && (
            <>
              <Text style={styles.sectionTitle}>نبذة عن الطبيب</Text>
              <Text style={styles.bioText}>{doctor.bio}</Text>

              <Text style={styles.sectionTitle}>اللغات</Text>
              <View style={styles.langRow}>
                {doctor.languages.map((l) => (
                  <View key={l} style={styles.langChip}>
                    <Text style={styles.langText}>{l}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>الشهادات والمؤهلات</Text>
              <View style={styles.certRow}>
                {doctor.certifications.map((c) => (
                  <View key={c} style={styles.certItem}>
                    <Text style={styles.certText}>{c}</Text>
                    <Feather name="award" size={16} color={colors.primary} />
                  </View>
                ))}
              </View>
            </>
          )}

          {tab === "reviews" && (
            <>
              <Text style={styles.sectionTitle}>آراء المرضى</Text>
              {MOCK_REVIEWS.map((r) => (
                <View key={r.id} style={styles.reviewCard}>
                  <View style={styles.reviewTop}>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                    <Text style={styles.reviewName}>{r.name}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Feather key={i} name="star" size={14} color={i < r.stars ? "#F59E0B" : colors.border} />
                    ))}
                  </View>
                  <Text style={styles.reviewText}>{r.comment}</Text>
                </View>
              ))}
            </>
          )}

          {tab === "slots" && (
            <>
              <Text style={styles.sectionTitle}>اختر موعداً مناسباً — اليوم</Text>
              <View style={styles.slotsGrid}>
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <Pressable
                      key={slot}
                      style={[
                        styles.slotBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.card,
                          borderColor: isSelected ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedSlot(slot); }}
                    >
                      <Text style={[styles.slotText, { color: isSelected ? "#FFF" : colors.foreground }]}>
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.chatBtn}
          onPress={() => Alert.alert("قريباً", "ميزة الدردشة ستتوفر قريباً 💬")}
        >
          <Feather name="message-circle" size={22} color={colors.dark} />
        </Pressable>

        <View style={styles.priceWrap}>
          <Text style={styles.priceLabel}>رسوم الزيارة</Text>
          <Text style={styles.price}>
            {doctor.price} <Text style={styles.priceUnit}>ر.س</Text>
          </Text>
        </View>

        <Pressable
          style={styles.bookBtn}
          onPress={() => {
            if (!doctor.available) {
              Alert.alert("غير متاح", "الطبيب غير متاح حالياً، يمكنك تحديد موعد لاحق من تبويب المواعيد.");
              setTab("slots");
              return;
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setTab("slots");
            setShowBooking(true);
          }}
        >
          <LinearGradient
            colors={["#003F6D", "#0A5FA0", "#259CF4"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
          />
          <Text style={styles.bookBtnText}>
            {selectedSlot ? `احجز — ${selectedSlot}` : "احجز زيارة منزلية"}
          </Text>
        </Pressable>
      </View>

      {/* Quick confirm if slot selected */}
      {selectedSlot && showBooking && (
        <Pressable
          style={[styles.bottomBar, { bottom: 82 + insets.bottom, borderTopWidth: 0 }]}
          onPress={confirmBooking}
        >
          <LinearGradient
            colors={["#059669", "#10B981"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 14, margin: 8 }]}
          />
          <Text style={[styles.bookBtnText, { flex: 1, textAlign: "center" }]}>
            ✓ تأكيد الحجز في الساعة {selectedSlot}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
