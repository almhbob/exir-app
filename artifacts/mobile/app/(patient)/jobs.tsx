import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

const TYPE_LABELS = {
  full_time: "دوام كامل",
  part_time: "دوام جزئي",
  freelance: "مستقل",
};

const TYPE_COLORS = {
  full_time: "#059669",
  part_time: "#7C3AED",
  freelance: "#D97706",
};

export default function JobsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { jobs } = useApp();
  const [activeFilter, setActiveFilter] = useState("الكل");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const FILTERS = ["الكل", "مستقل", "دوام كامل", "دوام جزئي"];

  const filtered = jobs.filter((j) => {
    if (activeFilter === "الكل") return true;
    return TYPE_LABELS[j.type] === activeFilter;
  });

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
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 100,
    },
    countText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    subtitle: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      textAlign: "right",
    },
    filtersRow: { gap: 8 },
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
    urgentCard: {
      borderColor: colors.primary + "60",
      borderWidth: 1.5,
    },
    cardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    urgentBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
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
    jobTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      flex: 1,
      marginLeft: 8,
    },
    facility: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      textAlign: "right",
      marginBottom: 10,
    },
    infoRow: {
      flexDirection: "row",
      gap: 16,
      justifyContent: "flex-end",
      marginBottom: 10,
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
    desc: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 20,
      textAlign: "right",
      marginBottom: 14,
    },
    cardBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    typeBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    typeText: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    salaryRow: {
      alignItems: "flex-end",
    },
    salaryLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    salary: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.success,
      fontFamily: "Inter_700Bold",
    },
    applyBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 9,
      borderRadius: colors.radius,
    },
    applyText: {
      color: "#FFF",
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    heroBanner: {
      margin: 16,
      marginBottom: 4,
      backgroundColor: colors.primary,
      borderRadius: colors.radius + 4,
      padding: 20,
    },
    heroBannerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 6,
    },
    heroBannerText: {
      fontSize: 13,
      color: "rgba(255,255,255,0.85)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      lineHeight: 20,
    },
    space: { height: 100 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{jobs.length} وظيفة</Text>
          </View>
          <Text style={styles.title}>فرص عمل طبية</Text>
        </View>
        <Text style={styles.subtitle}>
          فرص للأطباء والممرضين والمختصين الطبيين
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    activeFilter === f ? colors.primary : colors.muted,
                  borderColor:
                    activeFilter === f ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === f ? "#FFF" : colors.foreground },
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(j) => j.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ marginBottom: 4 }}>
            <View style={styles.heroBanner}>
              <Text style={styles.heroBannerTitle}>
                انضم لمنصة طبيبك المهنية
              </Text>
              <Text style={styles.heroBannerText}>
                أكثر من 500 طبيب ومختص يعملون معنا. اعمل بحريتك الكاملة وحدد
                وقتك وأسعارك.
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={<View style={styles.space} />}
        renderItem={({ item }) => {
          const typeColor = TYPE_COLORS[item.type];
          return (
            <View style={[styles.card, item.urgent && styles.urgentCard]}>
              <View style={styles.cardTop}>
                {item.urgent ? (
                  <View style={styles.urgentBadge}>
                    <Feather name="zap" size={10} color="#DC2626" />
                    <Text style={styles.urgentText}>عاجل</Text>
                  </View>
                ) : (
                  <View />
                )}
                <Text style={styles.jobTitle}>{item.title}</Text>
              </View>

              <Text style={styles.facility}>{item.facility}</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoText}>{item.posted}</Text>
                  <Feather name="clock" size={12} color={colors.mutedForeground} />
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoText}>{item.location}</Text>
                  <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                </View>
              </View>

              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.cardBottom}>
                <Pressable
                  style={styles.applyBtn}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    Alert.alert(
                      "التقديم على الوظيفة",
                      `سيتم إرسال طلبك لـ ${item.facility}. هل تريد المتابعة؟`,
                      [
                        { text: "إلغاء", style: "cancel" },
                        {
                          text: "تقديم",
                          onPress: () =>
                            Alert.alert("تم التقديم", "سيتم التواصل معك خلال 24 ساعة."),
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.applyText}>تقديم طلب</Text>
                </Pressable>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>الراتب</Text>
                  <Text style={styles.salary}>{item.salary}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
