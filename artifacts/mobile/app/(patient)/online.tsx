import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface GlobalDoctor {
  id: string;
  name: string;
  nameEn: string;
  specialty: string;
  country: string;
  countryFlag: string;
  languages: string[];
  rating: number;
  reviews: number;
  experience: number;
  price: number;
  available: boolean;
  nextSlot?: string;
  avatar: string;
  timezone: string;
  bio: string;
}

const GLOBAL_DOCTORS: GlobalDoctor[] = [
  {
    id: "gd1",
    name: "د. سارة الجنيبي",
    nameEn: "Dr. Sarah Al-Junaidi",
    specialty: "طب القلب",
    country: "الإمارات",
    countryFlag: "🇦🇪",
    languages: ["العربية", "الإنجليزية"],
    rating: 4.9,
    reviews: 312,
    experience: 14,
    price: 120,
    available: true,
    avatar: "سج",
    timezone: "GST +4",
    bio: "استشارية قلب وأوعية دموية — زميلة الكلية الأمريكية لطب القلب",
  },
  {
    id: "gd2",
    name: "د. أحمد الفارسي",
    nameEn: "Dr. Ahmed Al-Farsi",
    specialty: "طب الأطفال",
    country: "السعودية",
    countryFlag: "🇸🇦",
    languages: ["العربية", "الإنجليزية", "الفرنسية"],
    rating: 4.8,
    reviews: 198,
    experience: 11,
    price: 90,
    available: true,
    avatar: "أف",
    timezone: "AST +3",
    bio: "طبيب أطفال معتمد من البورد السعودي والأوروبي",
  },
  {
    id: "gd3",
    name: "د. ليلى حسين",
    nameEn: "Dr. Layla Hussein",
    specialty: "الطب النفسي",
    country: "مصر",
    countryFlag: "🇪🇬",
    languages: ["العربية", "الإنجليزية"],
    rating: 4.9,
    reviews: 445,
    experience: 16,
    price: 100,
    available: false,
    nextSlot: "اليوم 8:00 م",
    avatar: "له",
    timezone: "EET +2",
    bio: "استشارية طب نفسي وعلاج معرفي سلوكي — عضو الجمعية الأمريكية للطب النفسي",
  },
  {
    id: "gd4",
    name: "د. كريم بوعزيزي",
    nameEn: "Dr. Karim Bouazizi",
    specialty: "طب الجلدية",
    country: "تونس",
    countryFlag: "🇹🇳",
    languages: ["العربية", "الفرنسية", "الإنجليزية"],
    rating: 4.7,
    reviews: 167,
    experience: 9,
    price: 80,
    available: true,
    avatar: "كب",
    timezone: "CET +1",
    bio: "أخصائي جلدية وتجميل — عضو الأكاديمية الأوروبية للأمراض الجلدية",
  },
  {
    id: "gd5",
    name: "د. نورة العمري",
    nameEn: "Dr. Nora Al-Omari",
    specialty: "التغذية العلاجية",
    country: "الكويت",
    countryFlag: "🇰🇼",
    languages: ["العربية", "الإنجليزية"],
    rating: 4.8,
    reviews: 290,
    experience: 8,
    price: 70,
    available: false,
    nextSlot: "غداً 10:00 ص",
    avatar: "نع",
    timezone: "AST +3",
    bio: "أخصائية تغذية علاجية معتمدة — متخصصة في أمراض السكري والسمنة",
  },
  {
    id: "gd6",
    name: "د. علي رضا",
    nameEn: "Dr. Ali Reza",
    specialty: "العيون",
    country: "الأردن",
    countryFlag: "🇯🇴",
    languages: ["العربية", "الإنجليزية"],
    rating: 4.9,
    reviews: 502,
    experience: 20,
    price: 110,
    available: true,
    avatar: "عر",
    timezone: "EET +2",
    bio: "استشاري عيون وجراحة الليزك — حاصل على البورد الأمريكي والبريطاني",
  },
];

const SPECIALTIES = ["الكل", "القلب", "الأطفال", "النفسية", "الجلدية", "التغذية", "العيون"];

type FilterTab = "all" | "now" | "schedule";

export default function OnlineConsultationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [specialty, setSpecialty] = useState("الكل");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<GlobalDoctor | null>(null);
  const [selectedType, setSelectedType] = useState<"video" | "audio">("video");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = GLOBAL_DOCTORS.filter((d) => {
    const matchTab =
      filterTab === "all" ||
      (filterTab === "now" && d.available) ||
      (filterTab === "schedule" && !d.available);
    const matchSpec =
      specialty === "الكل" || d.specialty.includes(specialty);
    return matchTab && matchSpec;
  });

  function bookConsultation(doc: GlobalDoctor) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDoc(doc);
    setShowModal(true);
  }

  function confirmBooking() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowModal(false);
    Alert.alert(
      "تم الحجز ✓",
      `سيتم إرسال رابط الاستشارة ${selectedType === "video" ? "المرئية" : "الصوتية"} على جوالك قبل 10 دقائق من الموعد.`
    );
  }

  const platformFee = selectedDoc ? Math.round(selectedDoc.price * 0.15) : 0;
  const doctorShare = selectedDoc ? selectedDoc.price - platformFee : 0;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // Header
    header: {
      paddingTop: topPad + 14,
      paddingHorizontal: 20,
      paddingBottom: 24,
      overflow: "hidden",
    },
    orb1: {
      position: "absolute", top: -50, right: -50,
      width: 180, height: 180, borderRadius: 90,
      backgroundColor: "rgba(124,58,237,0.25)",
    },
    orb2: {
      position: "absolute", bottom: -30, left: -40,
      width: 140, height: 140, borderRadius: 70,
      backgroundColor: "rgba(37,156,244,0.18)",
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.5,
      marginBottom: 4,
      textAlign: "right",
    },
    headerSub: {
      fontSize: 13,
      color: "rgba(255,255,255,0.72)",
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 20,
    },

    // Live counter pill
    livePill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderRadius: 100,
      paddingHorizontal: 14,
      paddingVertical: 7,
      alignSelf: "flex-end",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.2)",
      marginBottom: 16,
    },
    liveDot: {
      width: 8, height: 8, borderRadius: 4,
      backgroundColor: "#22C55E",
    },
    liveText: {
      fontSize: 13, color: "#FFF",
      fontFamily: "Inter_600SemiBold",
    },

    // Filter tabs
    filterTabs: {
      flexDirection: "row",
      gap: 8,
    },
    filterTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    filterTabText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },

    // Specialty row
    specRow: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 8,
    },
    specChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 100,
      borderWidth: 1.5,
    },
    specText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },

    // Stats banner
    statsBanner: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 20,
      gap: 10,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: colors.radius + 2,
      padding: 14,
      alignItems: "center",
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    statLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },

    // Doctor cards
    list: { paddingHorizontal: 16, gap: 12, paddingBottom: 110 },
    card: {
      backgroundColor: colors.card,
      borderRadius: colors.radius + 6,
      padding: 18,
      shadowColor: "#003F6D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.09,
      shadowRadius: 14,
      elevation: 5,
    },
    cardTop: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 14,
    },
    avatarWrap: {
      position: "relative",
    },
    avatar: {
      width: 62,
      height: 62,
      borderRadius: 31,
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
    flagBadge: {
      position: "absolute",
      bottom: -2,
      right: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    flagText: { fontSize: 14 },
    info: { flex: 1 },
    docName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 2,
    },
    docSpec: {
      fontSize: 13,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      textAlign: "right",
      marginBottom: 4,
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
    reviewText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    bio: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      lineHeight: 20,
      marginBottom: 12,
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 10,
      marginBottom: 12,
    },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: colors.muted,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    metaText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    langRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      justifyContent: "flex-end",
      marginBottom: 14,
    },
    langChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      backgroundColor: colors.accentLight,
      borderRadius: 100,
    },
    langText: {
      fontSize: 11,
      color: colors.dark,
      fontFamily: "Inter_600SemiBold",
    },
    cardBottom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    priceWrap: { alignItems: "flex-end" },
    priceLabel: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    price: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    priceUnit: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    availBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#DCFCE7",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    availDot: {
      width: 7, height: 7, borderRadius: 4,
      backgroundColor: "#22C55E",
    },
    availText: {
      fontSize: 12,
      color: "#16A34A",
      fontFamily: "Inter_700Bold",
    },
    nextBadge: {
      backgroundColor: colors.warningLight,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 100,
    },
    nextText: {
      fontSize: 12,
      color: colors.warning,
      fontFamily: "Inter_600SemiBold",
    },
    bookBtn: {
      borderRadius: colors.radius,
      paddingVertical: 10,
      paddingHorizontal: 20,
      overflow: "hidden",
    },
    bookBtnText: {
      color: "#FFF",
      fontSize: 14,
      fontFamily: "Inter_700Bold",
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      padding: 24,
      paddingBottom: 40,
    },
    modalHandle: {
      width: 40, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 4,
    },
    modalSub: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 20,
    },
    typeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 20,
    },
    typeCard: {
      flex: 1,
      borderRadius: colors.radius + 2,
      borderWidth: 2,
      padding: 16,
      alignItems: "center",
      gap: 8,
    },
    typeLabel: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
    },
    typeSub: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    revenueBox: {
      backgroundColor: colors.background,
      borderRadius: colors.radius + 2,
      padding: 16,
      marginBottom: 20,
    },
    revenueTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textAlign: "right",
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    revenueRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    revenueLabel: {
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    revenueValue: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    revenueDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    revenueTotalLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    revenueTotalValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.primary,
      fontFamily: "Inter_700Bold",
    },
    confirmBtn: {
      borderRadius: colors.radius,
      paddingVertical: 15,
      alignItems: "center",
      overflow: "hidden",
    },
    confirmText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
  });

  const nowCount = GLOBAL_DOCTORS.filter((d) => d.available).length;

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#1A0533", "#4C1D95", "#0A5FA0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.orb1} pointerEvents="none" />
        <View style={styles.orb2} pointerEvents="none" />

        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{nowCount} أطباء متاحون الآن</Text>
        </View>

        <Text style={styles.headerTitle}>استشارة أونلاين</Text>
        <Text style={styles.headerSub}>
          تواصل مع أخصائيين من العالم العربي وأبرز الدول — أينما كنت
        </Text>

        {/* Filter tabs */}
        <View style={styles.filterTabs}>
          {([
            { id: "all" as FilterTab, label: "الكل" },
            { id: "now" as FilterTab, label: "⚡ متاح الآن" },
            { id: "schedule" as FilterTab, label: "📅 جدول موعد" },
          ] as { id: FilterTab; label: string }[]).map((t) => (
            <Pressable
              key={t.id}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    filterTab === t.id ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.12)",
                  borderColor: filterTab === t.id ? "#FFF" : "rgba(255,255,255,0.25)",
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilterTab(t.id);
              }}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filterTab === t.id ? "#1A0533" : "rgba(255,255,255,0.9)" },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsBanner}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>+500</Text>
          <Text style={styles.statLabel}>طبيب معتمد</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>دولة</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>رضا المرضى</Text>
        </View>
      </View>

      {/* Specialty filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.specRow}
        style={{ marginTop: -4, marginBottom: 4 }}
      >
        {SPECIALTIES.map((s) => (
          <Pressable
            key={s}
            style={[
              styles.specChip,
              {
                backgroundColor: specialty === s ? colors.primary : colors.card,
                borderColor: specialty === s ? colors.primary : colors.border,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSpecialty(s);
            }}
          >
            <Text
              style={[
                styles.specText,
                { color: specialty === s ? "#FFF" : colors.foreground },
              ]}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Doctor list */}
      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: doc }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{doc.avatar}</Text>
                </View>
                <View style={styles.flagBadge}>
                  <Text style={styles.flagText}>{doc.countryFlag}</Text>
                </View>
              </View>
              <View style={styles.info}>
                <Text style={styles.docName}>{doc.name}</Text>
                <Text style={styles.docSpec}>{doc.specialty}</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.reviewText}>({doc.reviews})</Text>
                  <Text style={styles.ratingText}>{doc.rating}</Text>
                  <Feather name="star" size={13} color="#F59E0B" />
                </View>
              </View>
            </View>

            <Text style={styles.bio}>{doc.bio}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Feather name="clock" size={12} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{doc.experience} سنة خبرة</Text>
              </View>
              <View style={styles.metaChip}>
                <Feather name="globe" size={12} color={colors.mutedForeground} />
                <Text style={styles.metaText}>{doc.country} · {doc.timezone}</Text>
              </View>
            </View>

            <View style={styles.langRow}>
              {doc.languages.map((l) => (
                <View key={l} style={styles.langChip}>
                  <Text style={styles.langText}>{l}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardBottom}>
              <Pressable
                style={styles.bookBtn}
                onPress={() => bookConsultation(doc)}
              >
                <LinearGradient
                  colors={["#4C1D95", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
                />
                <Text style={styles.bookBtnText}>
                  {doc.available ? "ابدأ الآن" : "احجز موعد"}
                </Text>
              </Pressable>

              <View style={styles.priceWrap}>
                <Text style={styles.priceLabel}>رسوم الاستشارة</Text>
                <Text style={styles.price}>
                  {doc.price} <Text style={styles.priceUnit}>$</Text>
                </Text>
              </View>

              {doc.available ? (
                <View style={styles.availBadge}>
                  <View style={styles.availDot} />
                  <Text style={styles.availText}>متاح الآن</Text>
                </View>
              ) : (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextText}>{doc.nextSlot}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />

      {/* Booking Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              {selectedDoc?.available ? "ابدأ استشارتك الآن" : "احجز موعدك"}
            </Text>
            <Text style={styles.modalSub}>
              {selectedDoc?.name} — {selectedDoc?.specialty}
            </Text>

            {/* Consultation type */}
            <View style={styles.typeRow}>
              {([
                { type: "video" as const, icon: "video", label: "مرئية", sub: "كاميرا + صوت" },
                { type: "audio" as const, icon: "phone", label: "صوتية", sub: "صوت فقط" },
              ] as { type: "video" | "audio"; icon: string; label: string; sub: string }[]).map((t) => (
                <Pressable
                  key={t.type}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor:
                        selectedType === t.type ? colors.primaryLight : colors.background,
                      borderColor:
                        selectedType === t.type ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedType(t.type)}
                >
                  <Feather
                    name={t.icon as any}
                    size={24}
                    color={selectedType === t.type ? colors.primary : colors.mutedForeground}
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      { color: selectedType === t.type ? colors.primary : colors.foreground },
                    ]}
                  >
                    {t.label}
                  </Text>
                  <Text style={styles.typeSub}>{t.sub}</Text>
                </Pressable>
              ))}
            </View>

            {/* Revenue breakdown */}
            {selectedDoc && (
              <View style={styles.revenueBox}>
                <Text style={styles.revenueTitle}>تفاصيل الدفع</Text>
                <View style={styles.revenueRow}>
                  <Text style={[styles.revenueValue, { color: colors.primary }]}>
                    {doctorShare} $
                  </Text>
                  <Text style={styles.revenueLabel}>🩺 رسوم الطبيب (85%)</Text>
                </View>
                <View style={styles.revenueRow}>
                  <Text style={styles.revenueValue}>{platformFee} $</Text>
                  <Text style={styles.revenueLabel}>📱 رسوم المنصة (15%)</Text>
                </View>
                <View style={styles.revenueDivider} />
                <View style={styles.revenueRow}>
                  <Text style={styles.revenueTotalValue}>{selectedDoc.price} $</Text>
                  <Text style={styles.revenueTotalLabel}>المجموع</Text>
                </View>
              </View>
            )}

            <Pressable style={styles.confirmBtn} onPress={confirmBooking}>
              <LinearGradient
                colors={["#4C1D95", "#7C3AED", "#259CF4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
              />
              <Text style={styles.confirmText}>
                {selectedDoc?.available ? "ابدأ الاستشارة الآن" : "تأكيد الحجز"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
