import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
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

const MOCK_STATS = {
  todayVisits: 4,
  monthVisits: 67,
  todayEarnings: 720,
  monthEarnings: 12480,
  rating: 4.8,
  completionRate: 96,
};

const MOCK_RECENT = [
  {
    id: "r1",
    patient: "عبدالله محمد",
    time: "10:30 ص",
    address: "حي النزهة، الرياض",
    status: "completed",
    amount: 180,
  },
  {
    id: "r2",
    patient: "فاطمة أحمد",
    time: "12:00 م",
    address: "حي العليا، الرياض",
    status: "completed",
    amount: 180,
  },
  {
    id: "r3",
    patient: "محمد الشمري",
    time: "02:30 م",
    address: "حي الملك فهد، الرياض",
    status: "active",
    amount: 180,
  },
  {
    id: "r4",
    patient: "نورة السعيدي",
    time: "04:00 م",
    address: "حي الروضة، الرياض",
    status: "pending",
    amount: 180,
  },
];

export default function DoctorDashboard() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userProfile } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const STATUS_CONF: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: "مكتمل", color: colors.dark, bg: colors.mintLight },
    active: { label: "جارٍ الآن", color: "#259CF4", bg: "#E6F4FF" },
    pending: { label: "في الانتظار", color: colors.warning, bg: colors.warningLight },
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 16,
      paddingHorizontal: 20,
      paddingBottom: 24,
      backgroundColor: colors.dark,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    greeting: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    docName: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },
    specialty: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      fontFamily: "Inter_500Medium",
    },
    notifBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    onlineRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: colors.radius,
      padding: 14,
    },
    onlineLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    onlineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#22C55E",
    },
    onlineText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    onlineSub: {
      color: "rgba(255,255,255,0.7)",
      fontSize: 12,
      fontFamily: "Inter_400Regular",
    },
    toggleBtn: {
      backgroundColor: "#22C55E",
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
    },
    toggleText: {
      color: "#FFF",
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      padding: 16,
    },
    statCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 4,
      textAlign: "right",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
    },
    statSub: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    section: { paddingHorizontal: 16, marginBottom: 20 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
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
    visitCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 10,
    },
    visitAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    visitAvatarText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    visitInfo: { flex: 1 },
    visitPatient: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 2,
    },
    visitAddress: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    visitRight: { alignItems: "flex-end", gap: 4 },
    visitTime: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 100,
    },
    statusText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
    },
    space: { height: 100 },
    perf: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    perfRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    perfLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    perfValue: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    barBg: {
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      marginBottom: 14,
      overflow: "hidden",
    },
    barFill: {
      height: 6,
      backgroundColor: colors.primary,
      borderRadius: 3,
    },
  });

  const STAT_CARDS = [
    {
      label: "زيارات اليوم",
      value: MOCK_STATS.todayVisits.toString(),
      sub: "من أصل 6 متاحة",
      icon: "calendar",
      color: colors.primary,
      bg: colors.primaryLight,
    },
    {
      label: "أرباح اليوم",
      value: MOCK_STATS.todayEarnings + " ر.س",
      sub: "4 زيارات مكتملة",
      icon: "dollar-sign",
      color: colors.success,
      bg: colors.successLight,
    },
    {
      label: "زيارات الشهر",
      value: MOCK_STATS.monthVisits.toString(),
      sub: "أفضل من الشهر الماضي",
      icon: "trending-up",
      color: "#7C3AED",
      bg: "#F5F3FF",
    },
    {
      label: "أرباح الشهر",
      value: MOCK_STATS.monthEarnings.toLocaleString() + " ر.س",
      sub: "نمو 18% هذا الشهر",
      icon: "award",
      color: "#D97706",
      bg: "#FEF3C7",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.notifBtn}>
              <Feather name="bell" size={20} color="#FFF" />
            </Pressable>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.greeting}>مرحباً،</Text>
              <Text style={styles.docName}>
                {userProfile.name ? `د. ${userProfile.name}` : "الطبيب"}
              </Text>
              {userProfile.specialty ? (
                <Text style={styles.specialty}>{userProfile.specialty}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.onlineRow}>
            <Pressable
              style={styles.toggleBtn}
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }
            >
              <Text style={styles.toggleText}>متاح</Text>
            </Pressable>
            <View style={styles.onlineLeft}>
              <View>
                <Text style={styles.onlineText}>أنت متاح الآن</Text>
                <Text style={styles.onlineSub}>تلقي الطلبات الجديدة</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {STAT_CARDS.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View
                style={[styles.statIcon, { backgroundColor: s.bg }]}
              >
                <Feather name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.seeAll}>عرض الكل</Text>
            <Text style={styles.sectionTitle}>الأداء</Text>
          </View>
          <View style={styles.perf}>
            {[
              { label: "معدل التقييم", value: `${MOCK_STATS.rating}/5`, pct: 0.96 },
              { label: "نسبة الإكمال", value: `${MOCK_STATS.completionRate}%`, pct: 0.96 },
              { label: "الاستجابة السريعة", value: "< 5 دقائق", pct: 0.88 },
            ].map((p) => (
              <View key={p.label}>
                <View style={styles.perfRow}>
                  <Text style={styles.perfValue}>{p.value}</Text>
                  <Text style={styles.perfLabel}>{p.label}</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${p.pct * 100}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.seeAll}>عرض الكل</Text>
            <Text style={styles.sectionTitle}>زيارات اليوم</Text>
          </View>
          {MOCK_RECENT.map((v) => {
            const conf = STATUS_CONF[v.status];
            return (
              <Pressable key={v.id} style={styles.visitCard}>
                <View style={styles.visitRight}>
                  <Text style={styles.visitTime}>{v.time}</Text>
                  <View
                    style={[styles.statusBadge, { backgroundColor: conf.bg }]}
                  >
                    <Text style={[styles.statusText, { color: conf.color }]}>
                      {conf.label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.visitTime,
                      { color: colors.mint, fontFamily: "Inter_600SemiBold" },
                    ]}
                  >
                    {v.amount} ر.س
                  </Text>
                </View>
                <View style={styles.visitInfo}>
                  <Text style={styles.visitPatient}>{v.patient}</Text>
                  <Text style={styles.visitAddress}>{v.address}</Text>
                </View>
                <View style={styles.visitAvatar}>
                  <Text style={styles.visitAvatarText}>
                    {v.patient.split(" ").map((w) => w[0]).join("").substring(0, 2)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.space} />
      </ScrollView>
    </View>
  );
}
