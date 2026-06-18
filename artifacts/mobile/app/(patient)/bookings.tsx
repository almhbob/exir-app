import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

import { useApp, Booking } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type TabFilter = "all" | "active" | "completed" | "cancelled";

const STATUS_CONFIG: Record<
  Booking["status"],
  { label: string; color: string; bg: string; icon: string }
> = {
  pending: { label: "في الانتظار", color: "#D97706", bg: "#FEF3C7", icon: "clock" },
  confirmed: { label: "مؤكد", color: "#1E8070", bg: "#E6F4FF", icon: "check-circle" },
  active: { label: "جارٍ الآن", color: "#16A34A", bg: "#DCFCE7", icon: "navigation" },
  completed: { label: "مكتمل", color: "#64748B", bg: "#F1F5F9", icon: "check" },
  cancelled: { label: "ملغي", color: "#DC2626", bg: "#FEE2E2", icon: "x-circle" },
};

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { bookings, cancelBooking } = useApp();
  const [filter, setFilter] = useState<TabFilter>("all");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "active") return b.status === "active" || b.status === "confirmed";
    if (filter === "completed") return b.status === "completed";
    if (filter === "cancelled") return b.status === "cancelled";
    return true;
  });

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: topPad + 16,
      paddingHorizontal: 20,
      paddingBottom: 20,
      overflow: "hidden",
    },
    headerOrb1: {
      position: "absolute",
      top: -50,
      right: -50,
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: "rgba(37,156,244,0.2)",
    },
    headerOrb2: {
      position: "absolute",
      bottom: -20,
      left: -30,
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: "rgba(29,208,248,0.13)",
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      marginBottom: 16,
      textAlign: "right",
    },
    tabs: {
      flexDirection: "row",
      gap: 8,
    },
    tab: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    tabText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    list: { padding: 16, gap: 12 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 4,
      padding: 16,
      shadowColor: "#0E4D62",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 3,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    statusText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    doctorName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
    },
    specialty: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
      textAlign: "right",
      marginBottom: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 12,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    detailText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    priceText: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    addressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 8,
    },
    addressText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
      textAlign: "right",
    },
    notesRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 6,
      marginTop: 6,
    },
    notesText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      flex: 1,
      textAlign: "right",
      lineHeight: 18,
    },
    empty: {
      alignItems: "center",
      paddingTop: 80,
      gap: 14,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      fontSize: 17,
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
    actionRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    cancelBtn: {
      flex: 1, paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5, borderColor: "#EF4444",
      alignItems: "center",
    },
    cancelBtnText: {
      fontSize: 13, color: "#EF4444",
      fontFamily: "Inter_700Bold",
    },
    rateBtn: {
      flex: 1, paddingVertical: 10,
      borderRadius: 12,
      alignItems: "center", overflow: "hidden",
    },
    rateBtnText: {
      color: "#FFF", fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    ratedBadge: {
      flexDirection: "row", alignItems: "center",
      gap: 5, alignSelf: "flex-end",
      backgroundColor: "#FEF3C7",
      paddingHorizontal: 10, paddingVertical: 5,
      borderRadius: 100, marginTop: 10,
    },
    ratedText: {
      fontSize: 12, color: "#D97706",
      fontFamily: "Inter_600SemiBold",
    },
  });

  const TABS: { id: TabFilter; label: string }[] = [
    { id: "all", label: "الكل" },
    { id: "active", label: "نشطة" },
    { id: "completed", label: "مكتملة" },
    { id: "cancelled", label: "ملغاة" },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#082D40", "#0E4D62", "#1A7066"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOrb1} pointerEvents="none" />
        <View style={styles.headerOrb2} pointerEvents="none" />
        <Text style={styles.title}>حجوزاتي</Text>
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    filter === t.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.12)",
                  borderColor:
                    filter === t.id ? "#FFF" : "rgba(255,255,255,0.25)",
                },
              ]}
              onPress={() => setFilter(t.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: filter === t.id ? colors.dark : "rgba(255,255,255,0.85)" },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="calendar" size={32} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>لا توجد حجوزات</Text>
            <Text style={styles.emptyText}>
              لم تقم بحجز أي زيارة طبية بعد. ابدأ بالبحث عن طبيب.
            </Text>
          </View>
        }
        ListFooterComponent={<View style={styles.space} />}
        renderItem={({ item }) => {
          const statusConf = STATUS_CONFIG[item.status];
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConf.bg },
                  ]}
                >
                  <Feather
                    name={statusConf.icon as any}
                    size={12}
                    color={statusConf.color}
                  />
                  <Text
                    style={[styles.statusText, { color: statusConf.color }]}
                  >
                    {statusConf.label}
                  </Text>
                </View>
                <View>
                  <Text style={styles.doctorName}>{item.doctorName}</Text>
                  <Text style={styles.specialty}>{item.specialty}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.priceText}>{item.price.toLocaleString()} ج.س</Text>
                <View style={{ alignItems: "flex-end", gap: 4 }}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>{item.time}</Text>
                    <Feather name="clock" size={13} color={colors.mutedForeground} />
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>{item.date}</Text>
                    <Feather name="calendar" size={13} color={colors.mutedForeground} />
                  </View>
                </View>
              </View>

              {item.address ? (
                <View style={styles.addressRow}>
                  <Text style={styles.addressText}>{item.address}</Text>
                  <Feather name="map-pin" size={13} color={colors.mutedForeground} />
                </View>
              ) : null}

              {item.notes ? (
                <View style={styles.notesRow}>
                  <Text style={styles.notesText}>{item.notes}</Text>
                  <Feather name="file-text" size={13} color={colors.mutedForeground} />
                </View>
              ) : null}

              {/* Cancel for pending/confirmed */}
              {(item.status === "pending" || item.status === "confirmed") && (
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.cancelBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      Alert.alert(
                        "إلغاء الحجز",
                        `هل تريد إلغاء حجزك مع ${item.doctorName}؟`,
                        [
                          { text: "تراجع", style: "cancel" },
                          {
                            text: "تأكيد الإلغاء",
                            style: "destructive",
                            onPress: () => {
                              cancelBooking(item.id);
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.cancelBtnText}>إلغاء الحجز</Text>
                  </Pressable>
                </View>
              )}

              {/* Rate for completed unrated */}
              {item.status === "completed" && !item.rated && (
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.rateBtn}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      router.push({
                        pathname: "/rate",
                        params: {
                          bookingId: item.id,
                          doctorId: item.doctorId,
                          doctorName: item.doctorName,
                        },
                      });
                    }}
                  >
                    <LinearGradient
                      colors={["#D97706", "#F59E0B"]}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
                    />
                    <Text style={styles.rateBtnText}>⭐ قيّم تجربتك</Text>
                  </Pressable>
                </View>
              )}

              {/* Already rated */}
              {item.status === "completed" && item.rated && (
                <View style={styles.ratedBadge}>
                  <Feather name="star" size={12} color="#D97706" />
                  <Text style={styles.ratedText}>تم التقييم</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
