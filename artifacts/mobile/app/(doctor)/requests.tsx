import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface Request {
  id: string;
  patient: string;
  age: number;
  gender: "male" | "female";
  complaint: string;
  address: string;
  distance: string;
  urgency: "normal" | "urgent" | "emergency";
  time: string;
  amount: number;
}

const MOCK_REQUESTS: Request[] = [
  {
    id: "req1",
    patient: "أحمد الزهراني",
    age: 45,
    gender: "male",
    complaint: "ارتفاع ضغط الدم مع صداع شديد",
    address: "حي العليا، شارع العروبة",
    distance: "1.4 كم",
    urgency: "urgent",
    time: "الآن",
    amount: 200,
  },
  {
    id: "req2",
    patient: "هدى المطيري",
    age: 32,
    gender: "female",
    complaint: "حمى وسعال وضيق في التنفس",
    address: "حي النزهة، شارع الأمير سلطان",
    distance: "2.2 كم",
    urgency: "normal",
    time: "منذ 5 دقائق",
    amount: 180,
  },
  {
    id: "req3",
    patient: "طفل (7 أشهر)",
    age: 0,
    gender: "male",
    complaint: "حمى شديدة وبكاء مستمر",
    address: "حي الروضة، شارع الملك عبدالله",
    distance: "3.1 كم",
    urgency: "emergency",
    time: "منذ 2 دقيقة",
    amount: 250,
  },
  {
    id: "req4",
    patient: "فريدة البلوي",
    age: 68,
    gender: "female",
    complaint: "آلام في المفاصل وصعوبة في الحركة",
    address: "حي الملقا، شارع التخصصي",
    distance: "4.5 كم",
    urgency: "normal",
    time: "منذ 12 دقيقة",
    amount: 180,
  },
  {
    id: "req5",
    patient: "خالد العنزي",
    age: 28,
    gender: "male",
    complaint: "التواء في الكاحل وعدم القدرة على المشي",
    address: "حي الصحافة، شارع الوادي",
    distance: "5.8 كم",
    urgency: "normal",
    time: "منذ 20 دقيقة",
    amount: 180,
  },
];

const URGENCY_CONFIG = {
  normal: { label: "عادي", color: "#259CF4", bg: "#E6F4FF" },
  urgent: { label: "عاجل", color: "#D97706", bg: "#FEF3C7" },
  emergency: { label: "طارئ", color: "#DC2626", bg: "#FEE2E2" },
};

export default function RequestsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [filter, setFilter] = useState<"all" | "urgent" | "emergency">("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = requests.filter((r) => {
    if (filter === "all") return true;
    return r.urgency === filter;
  });

  function acceptRequest(id: string) {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      "قبول الطلب",
      `تم قبول طلب ${req.patient}. يرجى التوجه فوراً إلى العنوان المحدد.`,
      [
        {
          text: "تم",
          onPress: () => setRequests((prev) => prev.filter((r) => r.id !== id)),
        },
      ]
    );
  }

  function declineRequest(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

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
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    countBadge: {
      backgroundColor: colors.warningLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 100,
    },
    countText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.warning,
      fontFamily: "Inter_700Bold",
    },
    subtitle: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      textAlign: "right",
    },
    filterRow: {
      flexDirection: "row",
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    filterText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    list: { padding: 16, gap: 12 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emergencyCard: {
      borderColor: "#DC2626",
      borderWidth: 2,
    },
    urgentCard: {
      borderColor: "#D97706",
      borderWidth: 1.5,
    },
    cardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    urgencyBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    urgencyText: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    patientName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
    },
    patientMeta: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    complaint: {
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
      textAlign: "right",
      backgroundColor: colors.muted,
      padding: 12,
      borderRadius: colors.radius,
      marginBottom: 12,
      lineHeight: 22,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 16,
      marginBottom: 14,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    btnRow: {
      flexDirection: "row",
      gap: 10,
    },
    acceptBtn: {
      flex: 1,
      backgroundColor: colors.dark,
      borderRadius: colors.radius,
      paddingVertical: 12,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    acceptText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_700Bold",
    },
    declineBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
    },
    amountBadge: {
      backgroundColor: colors.mintLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 100,
      alignSelf: "flex-end",
      marginBottom: 12,
    },
    amountText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.dark,
      fontFamily: "Inter_700Bold",
    },
    empty: {
      alignItems: "center",
      paddingTop: 80,
      gap: 14,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    emptyText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      paddingHorizontal: 40,
    },
    space: { height: 100 },
  });

  const FILTER_TABS = [
    { id: "all" as const, label: `الكل (${requests.length})` },
    { id: "urgent" as const, label: "عاجل" },
    { id: "emergency" as const, label: "طوارئ" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length} طلب</Text>
          </View>
          <Text style={styles.title}>الطلبات الواردة</Text>
        </View>
        <Text style={styles.subtitle}>اقبل أو ارفض الطلبات القريبة منك</Text>
        <View style={styles.filterRow}>
          {FILTER_TABS.map((t) => (
            <Pressable
              key={t.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === t.id ? colors.primary : colors.muted,
                  borderColor: filter === t.id ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setFilter(t.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === t.id ? "#FFF" : colors.foreground },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="check-circle" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>لا توجد طلبات</Text>
            <Text style={styles.emptyText}>
              لا توجد طلبات زيارة جديدة في منطقتك الآن. تأكد أنك في وضع المتاح.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={styles.space} />}
        renderItem={({ item }) => {
          const urgConf = URGENCY_CONFIG[item.urgency];
          return (
            <View
              style={[
                styles.card,
                item.urgency === "emergency" && styles.emergencyCard,
                item.urgency === "urgent" && styles.urgentCard,
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.urgencyBadge, { backgroundColor: urgConf.bg }]}>
                  <Text style={[styles.urgencyText, { color: urgConf.color }]}>
                    {urgConf.label}
                  </Text>
                </View>
                <View>
                  <Text style={styles.patientName}>{item.patient}</Text>
                  <Text style={styles.patientMeta}>
                    {item.age > 0 ? `${item.age} سنة` : "رضيع"} ·{" "}
                    {item.gender === "male" ? "ذكر" : "أنثى"} · {item.time}
                  </Text>
                </View>
              </View>

              <Text style={styles.complaint}>{item.complaint}</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoText}>{item.distance}</Text>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoText}>{item.address}</Text>
                  <Feather name="navigation" size={12} color={colors.mutedForeground} />
                </View>
              </View>

              <View style={styles.amountBadge}>
                <Text style={styles.amountText}>{item.amount} ر.س</Text>
              </View>

              <View style={styles.btnRow}>
                <Pressable
                  style={styles.declineBtn}
                  onPress={() => declineRequest(item.id)}
                >
                  <Feather name="x" size={18} color={colors.mutedForeground} />
                </Pressable>
                <Pressable
                  style={styles.acceptBtn}
                  onPress={() => acceptRequest(item.id)}
                >
                  <Feather name="check" size={16} color="#FFF" />
                  <Text style={styles.acceptText}>قبول الطلب</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
