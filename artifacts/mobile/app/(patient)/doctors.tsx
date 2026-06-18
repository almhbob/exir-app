import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, Booking, DoctorProfile } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const FILTER_SPECS = [
  "الكل",
  "طب عام",
  "الأطفال",
  "الباطنة",
  "الجلدية",
  "القلب",
  "العظام",
  "نفسية",
];

export default function DoctorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { doctors, addBooking, userProfile } = useApp();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookAddress, setBookAddress] = useState(userProfile.address || "");
  const [bookNotes, setBookNotes] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = doctors.filter((d) => {
    const matchSearch =
      !search ||
      d.name.includes(search) ||
      d.specialty.includes(search);
    const matchFilter =
      activeFilter === "الكل" || d.specialty.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  function openBookModal(doc: DoctorProfile) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDoctor(doc);
    setShowBookModal(true);
  }

  async function confirmBooking() {
    if (!selectedDoctor || !bookAddress.trim()) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const now = new Date();
    const booking: Booking = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 6),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: now.toLocaleDateString("ar-SA"),
      time: now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      status: "confirmed",
      address: bookAddress,
      notes: bookNotes,
      price: selectedDoctor.price,
    };
    await addBooking(booking);
    setShowBookModal(false);
    setBookNotes("");
    Alert.alert("تم الحجز", `تم تأكيد حجزك مع ${selectedDoctor.name}. سيصل إليك قريباً.`);
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
    headerTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 12,
      textAlign: "right",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.muted,
      borderRadius: colors.radius,
      paddingHorizontal: 12,
      paddingVertical: 10,
      gap: 8,
      marginBottom: 12,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
    },
    filtersRow: { gap: 8 },
    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    filterChipText: {
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
    cardTop: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    info: { flex: 1 },
    docName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
      textAlign: "right",
    },
    docSpec: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 6,
      textAlign: "right",
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      justifyContent: "flex-end",
    },
    ratingText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    reviewCount: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    metaRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
      justifyContent: "flex-end",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    cardBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    price: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    priceSub: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    bookBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: colors.radius,
    },
    bookBtnDisabled: { backgroundColor: colors.muted },
    bookBtnText: {
      color: "#FFF",
      fontSize: 13,
      fontFamily: "Inter_700Bold",
    },
    bookBtnTextDisabled: { color: colors.mutedForeground },
    unavailable: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: colors.radius,
      backgroundColor: colors.muted,
    },
    unavailText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    availBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    availDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
    },
    availText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
    },
    empty: {
      alignItems: "center",
      paddingTop: 60,
      gap: 12,
    },
    emptyText: {
      fontSize: 16,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    modalHandle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
      textAlign: "right",
    },
    modalSub: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginBottom: 24,
      textAlign: "right",
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 8,
      textAlign: "right",
    },
    input: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      textAlign: "right",
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.primaryLight,
      borderRadius: colors.radius,
      padding: 14,
      marginBottom: 20,
    },
    priceLabel: {
      fontSize: 14,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    priceValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    confirmBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 15,
      alignItems: "center",
    },
    confirmBtnText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
    cancelBtn: {
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 8,
    },
    cancelText: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>أطباء ومختصون</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث بالاسم أو التخصص"
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTER_SPECS.map((f) => (
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(f);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
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
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={40} color={colors.mutedForeground} />
            <Text style={styles.emptyText}>لا يوجد أطباء بهذا البحث</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={styles.docName}>{item.name}</Text>
                <Text style={styles.docSpec}>{item.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.reviewCount}>({item.reviewCount})</Text>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Feather name="star" size={13} color="#F59E0B" />
                </View>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>{item.distance}</Text>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaText}>{item.experience} سنة</Text>
                <Feather name="award" size={12} color={colors.mutedForeground} />
              </View>
              <View style={[styles.availBadge]}>
                <Text
                  style={[
                    styles.availText,
                    { color: item.available ? colors.success : colors.mutedForeground },
                  ]}
                >
                  {item.available ? "متاح الآن" : "غير متاح"}
                </Text>
                <View
                  style={[
                    styles.availDot,
                    {
                      backgroundColor: item.available
                        ? colors.success
                        : colors.mutedForeground,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.cardBottom}>
              {item.available ? (
                <Pressable
                  style={styles.bookBtn}
                  onPress={() => openBookModal(item)}
                >
                  <Text style={styles.bookBtnText}>احجز زيارة</Text>
                </Pressable>
              ) : (
                <View style={styles.unavailable}>
                  <Text style={styles.unavailText}>غير متاح حالياً</Text>
                </View>
              )}
              <View>
                <Text style={styles.price}>{item.price} ر.س</Text>
                <Text style={styles.priceSub}>للزيارة</Text>
              </View>
            </View>
          </View>
        )}
      />

      <Modal
        visible={showBookModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              احجز مع {selectedDoctor?.name}
            </Text>
            <Text style={styles.modalSub}>
              {selectedDoctor?.specialty} · {selectedDoctor?.experience} سنة خبرة
            </Text>

            <Text style={styles.inputLabel}>عنوان الزيارة</Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل عنوانك الكامل"
              placeholderTextColor={colors.mutedForeground}
              value={bookAddress}
              onChangeText={setBookAddress}
              multiline
            />

            <Text style={styles.inputLabel}>ملاحظات للطبيب (اختياري)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="أوصف الحالة أو الأعراض..."
              placeholderTextColor={colors.mutedForeground}
              value={bookNotes}
              onChangeText={setBookNotes}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{selectedDoctor?.price} ر.س</Text>
              <Text style={styles.priceLabel}>رسوم الزيارة</Text>
            </View>

            <Pressable
              style={[
                styles.confirmBtn,
                !bookAddress.trim() && { opacity: 0.4 },
              ]}
              onPress={confirmBooking}
              disabled={!bookAddress.trim()}
            >
              <Text style={styles.confirmBtnText}>تأكيد الحجز</Text>
            </Pressable>
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setShowBookModal(false)}
            >
              <Text style={styles.cancelText}>إلغاء</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
