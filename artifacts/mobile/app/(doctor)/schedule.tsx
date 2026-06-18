import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

import { useColors } from "@/hooks/useColors";

const DAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function getWeekDays() {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const MOCK_SCHEDULE = [
  {
    id: "s1",
    time: "09:00 ص",
    patient: "سعد النمر",
    complaint: "فحص دوري للسكري",
    address: "حي العليا",
    status: "confirmed",
    amount: 180,
    dayOffset: 0,
  },
  {
    id: "s2",
    time: "11:30 ص",
    patient: "ليلى الحربي",
    complaint: "متابعة ضغط الدم",
    address: "حي النزهة",
    status: "confirmed",
    amount: 180,
    dayOffset: 0,
  },
  {
    id: "s3",
    time: "02:00 م",
    patient: "محمد القحطاني",
    complaint: "كشف عام وتقييم صحي",
    address: "حي الملقا",
    status: "pending",
    amount: 200,
    dayOffset: 0,
  },
  {
    id: "s4",
    time: "04:30 م",
    patient: "أم وليد الغامدي",
    complaint: "تغيير ضمادات جرح عملية",
    address: "حي الروضة",
    status: "confirmed",
    amount: 150,
    dayOffset: 0,
  },
  {
    id: "s5",
    time: "10:00 ص",
    patient: "عبدالرحمن السبيعي",
    complaint: "آلام صدرية للمتابعة",
    address: "حي الورود",
    status: "confirmed",
    amount: 250,
    dayOffset: 1,
  },
  {
    id: "s6",
    time: "01:00 م",
    patient: "رهف المالكي",
    complaint: "حساسية جلدية",
    address: "حي الصحافة",
    status: "confirmed",
    amount: 180,
    dayOffset: 1,
  },
];

export default function ScheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const weekDays = getWeekDays();
  const [selectedDay, setSelectedDay] = useState(0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const todayVisits = MOCK_SCHEDULE.filter((s) => s.dayOffset === selectedDay);

  const STATUS_CONF: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: "مؤكد", color: "#259CF4", bg: "#E6F4FF" },
    pending: { label: "في الانتظار", color: "#D97706", bg: "#FEF3C7" },
    completed: { label: "مكتمل", color: "#16A34A", bg: "#DCFCE7" },
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 0,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    monthLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    calRow: {
      flexDirection: "row",
      gap: 8,
      paddingBottom: 16,
    },
    dayBtn: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 10,
      borderRadius: colors.radius,
      borderWidth: 1.5,
    },
    dayName: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      marginBottom: 4,
    },
    dayNum: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
    summary: {
      flexDirection: "row",
      gap: 12,
      padding: 16,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius,
      padding: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryValue: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    list: { padding: 16, gap: 0 },
    visitItem: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    timeCol: {
      width: 64,
      alignItems: "flex-end",
    },
    timeText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
      textAlign: "right",
      lineHeight: 20,
    },
    line: {
      alignItems: "center",
      width: 20,
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.dark,
      marginTop: 4,
    },
    vertLine: {
      width: 2,
      flex: 1,
      backgroundColor: colors.border,
      marginTop: 4,
    },
    visitCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 4,
    },
    visitPatient: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 4,
    },
    visitComplaint: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 8,
    },
    visitMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    visitAmount: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    empty: {
      alignItems: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    space: { height: 100 },
  });

  const totalEarnings = todayVisits.reduce((sum, v) => sum + v.amount, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.monthLabel}>
            {MONTHS_AR[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
          </Text>
          <Text style={styles.title}>جدولي</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calRow}
        >
          {weekDays.map((d, i) => {
            const isSelected = selectedDay === i;
            const isToday = i === 0;
            const visits = MOCK_SCHEDULE.filter((s) => s.dayOffset === i);
            return (
              <Pressable
                key={i}
                style={[
                  styles.dayBtn,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.muted,
                    borderColor: isSelected ? colors.primary : colors.border,
                    minWidth: 44,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(i);
                }}
              >
                <Text
                  style={[
                    styles.dayName,
                    { color: isSelected ? "#FFF" : colors.mutedForeground },
                  ]}
                >
                  {DAYS_AR[d.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.dayNum,
                    { color: isSelected ? "#FFF" : colors.foreground },
                  ]}
                >
                  {d.getDate()}
                </Text>
                {visits.length > 0 && (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: isSelected ? "rgba(255,255,255,0.8)" : colors.primary,
                      marginTop: 3,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{todayVisits.length}</Text>
          <Text style={styles.summaryLabel}>زيارة مجدولة</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalEarnings}</Text>
          <Text style={styles.summaryLabel}>ر.س متوقعة</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { fontSize: 16 }]}>
            {todayVisits.filter((v) => v.status === "confirmed").length}/
            {todayVisits.length}
          </Text>
          <Text style={styles.summaryLabel}>مؤكدة</Text>
        </View>
      </View>

      <FlatList
        data={todayVisits}
        keyExtractor={(v) => v.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="calendar" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyText}>لا توجد زيارات هذا اليوم</Text>
          </View>
        }
        ListFooterComponent={<View style={styles.space} />}
        renderItem={({ item, index }) => {
          const conf = STATUS_CONF[item.status];
          const isLast = index === todayVisits.length - 1;
          return (
            <View style={styles.visitItem}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.line}>
                <View style={styles.dot} />
                {!isLast && <View style={styles.vertLine} />}
              </View>
              <View style={styles.visitCard}>
                <Text style={styles.visitPatient}>{item.patient}</Text>
                <Text style={styles.visitComplaint}>{item.complaint}</Text>
                <View style={styles.visitMeta}>
                  <Text style={styles.visitAmount}>{item.amount} ر.س</Text>
                  <View style={[styles.statusBadge, { backgroundColor: conf.bg }]}>
                    <Text style={[styles.statusText, { color: conf.color }]}>
                      {conf.label}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
