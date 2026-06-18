import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

const EARNINGS_HISTORY = [
  { id: "e1", date: "اليوم", amount: 720, visits: 4 },
  { id: "e2", date: "أمس", amount: 540, visits: 3 },
  { id: "e3", date: "الثلاثاء", amount: 900, visits: 5 },
  { id: "e4", date: "الاثنين", amount: 360, visits: 2 },
  { id: "e5", date: "الأحد", amount: 720, visits: 4 },
  { id: "e6", date: "السبت", amount: 180, visits: 1 },
];

const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو"];
const MONTH_EARNINGS = [8200, 9400, 10800, 11200, 12480, 13000];

export default function EarningsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { jobs } = useApp();
  const [tab, setTab] = useState<"earnings" | "jobs">("earnings");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const maxEarning = Math.max(...MONTH_EARNINGS);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 16,
    },
    tabRow: {
      flexDirection: "row",
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      padding: 4,
    },
    tabBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: colors.radius - 2,
    },
    tabText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
    },
    earningsHero: {
      margin: 16,
      backgroundColor: colors.dark,
      borderRadius: colors.radius + 4,
      padding: 20,
    },
    heroLabel: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 4,
    },
    heroAmount: {
      fontSize: 36,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 4,
    },
    heroSub: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    heroRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    heroStat: {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: colors.radius,
      padding: 12,
      flex: 1,
      marginHorizontal: 4,
      alignItems: "center",
    },
    heroStatValue: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },
    heroStatLabel: {
      fontSize: 11,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    section: { paddingHorizontal: 16, marginBottom: 20 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 14,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      height: 100,
    },
    barContainer: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    bar: {
      width: "100%",
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    barLabel: {
      fontSize: 10,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    historyCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    historyDate: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      flex: 1,
      textAlign: "right",
    },
    historyMeta: {
      alignItems: "center",
      marginLeft: 16,
    },
    historyAmount: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    historyVisits: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    withdrawBtn: {
      margin: 16,
      backgroundColor: colors.dark,
      borderRadius: colors.radius,
      paddingVertical: 14,
      alignItems: "center",
    },
    withdrawText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
    joinBanner: {
      backgroundColor: colors.dark,
      borderRadius: colors.radius + 4,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    joinBannerIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      backgroundColor: "rgba(255,255,255,0.12)",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    joinBannerInfo: {
      flex: 1,
      alignItems: "flex-end",
    },
    joinBannerTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 3,
    },
    joinBannerSub: {
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    // Jobs section
    jobCard: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    urgentJobCard: {
      borderColor: colors.primary + "80",
    },
    jobTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    jobTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      flex: 1,
      textAlign: "right",
      marginLeft: 8,
    },
    urgentBadge: {
      backgroundColor: "#FEE2E2",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 100,
    },
    urgentText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#DC2626",
      fontFamily: "Inter_700Bold",
    },
    jobFacility: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      textAlign: "right",
      marginBottom: 8,
    },
    jobInfo: {
      flexDirection: "row",
      gap: 12,
      justifyContent: "flex-end",
      marginBottom: 10,
    },
    jobInfoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    jobInfoText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    jobBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    applyBtn: {
      backgroundColor: colors.dark,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: colors.radius,
    },
    applyText: {
      color: "#FFF",
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    salary: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.dark,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
    },
    salaryLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    space: { height: 100 },
  });

  const totalMonth = MONTH_EARNINGS[MONTH_EARNINGS.length - 1];
  const totalVisitsMonth = 67;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>الأرباح والفرص</Text>
        <View style={styles.tabRow}>
          <Pressable
            style={[
              styles.tabBtn,
              { backgroundColor: tab === "earnings" ? colors.card : "transparent" },
            ]}
            onPress={() => setTab("earnings")}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === "earnings" ? colors.primary : colors.mutedForeground },
              ]}
            >
              أرباحي
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabBtn,
              { backgroundColor: tab === "jobs" ? colors.card : "transparent" },
            ]}
            onPress={() => setTab("jobs")}
          >
            <Text
              style={[
                styles.tabText,
                { color: tab === "jobs" ? colors.primary : colors.mutedForeground },
              ]}
            >
              وظائف وفرص
            </Text>
          </Pressable>
        </View>
      </View>

      {tab === "earnings" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.earningsHero}>
            <Text style={styles.heroLabel}>أرباح هذا الشهر</Text>
            <Text style={styles.heroAmount}>
              {totalMonth.toLocaleString()} ر.س
            </Text>
            <Text style={styles.heroSub}>نمو 18% مقارنة بالشهر الماضي</Text>
            <View style={styles.heroRow}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{totalVisitsMonth}</Text>
                <Text style={styles.heroStatLabel}>زيارة</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>4.8</Text>
                <Text style={styles.heroStatLabel}>تقييم</Text>
              </View>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>96%</Text>
                <Text style={styles.heroStatLabel}>إكمال</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الأرباح الشهرية</Text>
            <View style={styles.chartRow}>
              {MONTHS.map((m, i) => (
                <View key={m} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (MONTH_EARNINGS[i] / maxEarning) * 80,
                        opacity: i === MONTHS.length - 1 ? 1 : 0.5,
                      },
                    ]}
                  />
                  <Text style={styles.barLabel}>{m.substring(0, 3)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>سجل الأرباح</Text>
            {EARNINGS_HISTORY.map((e) => (
              <View key={e.id} style={styles.historyCard}>
                <View style={styles.historyMeta}>
                  <Text style={styles.historyAmount}>{e.amount} ر.س</Text>
                  <Text style={styles.historyVisits}>{e.visits} زيارات</Text>
                </View>
                <Text style={styles.historyDate}>{e.date}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.withdrawBtn}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("طلب سحب", "سيتم تحويل رصيدك خلال 24-48 ساعة عمل.");
            }}
          >
            <Text style={styles.withdrawText}>سحب الأرباح</Text>
          </Pressable>
          <View style={styles.space} />
        </ScrollView>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(j) => j.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListHeaderComponent={
            <Pressable
              style={styles.joinBanner}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/join-request");
              }}
            >
              <View style={styles.joinBannerIcon}>
                <Feather name="user-plus" size={20} color={colors.accent} />
              </View>
              <View style={styles.joinBannerInfo}>
                <Text style={styles.joinBannerTitle}>
                  غير مسجل بعد؟ قدّم طلب الانضمام
                </Text>
                <Text style={styles.joinBannerSub}>
                  طبيب · ممرض · صيدلي · مختبر · علاج طبيعي · مسعف
                </Text>
              </View>
              <Feather name="arrow-left" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>
          }
          renderItem={({ item }) => (
            <View style={[styles.jobCard, item.urgent && styles.urgentJobCard]}>
              <View style={styles.jobTop}>
                {item.urgent ? (
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentText}>عاجل</Text>
                  </View>
                ) : (
                  <View />
                )}
                <Text style={styles.jobTitle}>{item.title}</Text>
              </View>
              <Text style={styles.jobFacility}>{item.facility}</Text>
              <View style={styles.jobInfo}>
                <View style={styles.jobInfoItem}>
                  <Text style={styles.jobInfoText}>{item.posted}</Text>
                  <Feather name="clock" size={12} color={colors.mutedForeground} />
                </View>
                <View style={styles.jobInfoItem}>
                  <Text style={styles.jobInfoText}>{item.location}</Text>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                </View>
              </View>
              <View style={styles.jobBottom}>
                <Pressable
                  style={styles.applyBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Alert.alert("تقديم", `هل تريد التقدم لـ ${item.title}؟`, [
                      { text: "إلغاء", style: "cancel" },
                      {
                        text: "تقديم",
                        onPress: () =>
                          Alert.alert("تم", "سيتم التواصل معك خلال 24 ساعة."),
                      },
                    ]);
                  }}
                >
                  <Text style={styles.applyText}>تقديم طلب</Text>
                </Pressable>
                <View>
                  <Text style={styles.salaryLabel}>الراتب</Text>
                  <Text style={styles.salary}>{item.salary}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
