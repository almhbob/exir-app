import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface Specialty {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  docs: string[];
}

const SPECIALTIES: Specialty[] = [
  {
    id: "doctor_general",
    name: "طبيب عام",
    nameEn: "General Physician",
    icon: "activity",
    docs: ["رخصة مزاولة المهنة", "شهادة التخرج", "صورة الهوية"],
  },
  {
    id: "doctor_specialist",
    name: "طبيب متخصص",
    nameEn: "Specialist Doctor",
    icon: "award",
    docs: ["رخصة مزاولة المهنة", "شهادة التخصص / البورد", "صورة الهوية"],
  },
  {
    id: "nurse",
    name: "ممرض / ممرضة",
    nameEn: "Nurse",
    icon: "heart",
    docs: ["رخصة مزاولة التمريض", "شهادة التمريض", "صورة الهوية"],
  },
  {
    id: "lab",
    name: "فني مختبر",
    nameEn: "Lab Technician",
    icon: "droplet",
    docs: ["رخصة مزاولة المهنة", "شهادة تقنية المختبرات", "صورة الهوية"],
  },
  {
    id: "pharmacist",
    name: "صيدلي",
    nameEn: "Pharmacist",
    icon: "package",
    docs: ["رخصة الصيدلاني", "شهادة الصيدلة", "صورة الهوية"],
  },
  {
    id: "physiotherapy",
    name: "معالج طبيعي",
    nameEn: "Physiotherapist",
    icon: "zap",
    docs: ["رخصة العلاج الطبيعي", "شهادة العلاج الطبيعي", "صورة الهوية"],
  },
  {
    id: "paramedic",
    name: "مسعف",
    nameEn: "Paramedic / EMT",
    icon: "truck",
    docs: ["بطاقة الإسعاف", "شهادة الإسعاف الطارئ", "صورة الهوية"],
  },
  {
    id: "other",
    name: "تخصص آخر",
    nameEn: "Other",
    icon: "plus-circle",
    docs: ["رخصة مزاولة المهنة", "الشهادات ذات الصلة", "صورة الهوية"],
  },
];

const DISCLAIMER_CLAUSES = [
  "أُقرّ بصحة ودقة جميع البيانات والمؤهلات والتراخيص المقدمة، وأتحمل المسؤولية الكاملة عن أي معلومات مغلوطة.",
  "أتحمل المسؤولية الكاملة والمطلقة عن جودة ومهنية الخدمة الطبية المقدمة للمرضى من خلال المنصة.",
  "أتعهد بالالتزام الكامل بأخلاقيات المهنة والأنظمة والتعليمات الصحية المعمول بها في المملكة العربية السعودية.",
  "أُقرّ بأن أي نزاع أو خلاف ينشأ بيني وبين أي مريض يُعدّ شأناً يخصني وحدي دون أي تبعات على إدارة المنصة.",
  "أتفهم وأوافق على أن منصة طبيبك تعمل كوسيط تقني فحسب، وتوفّر بيئة رقمية آمنة لربط مزودي الخدمات بمتلقيها، ولا تتحمل أي مسؤولية قانونية أو مالية أو طبية تجاه أي طرف نتيجة الخدمات المقدمة عبرها.",
];

interface UploadedDoc {
  name: string;
  uri?: string;
  status: "uploaded" | "pending";
}

export default function JoinRequestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUserRole, setUserProfile } = useApp();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // Step management
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Specialty
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  // Step 2: Personal info
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  // Step 3: Professional info
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseAuthority, setLicenseAuthority] = useState("");
  const [experience, setExperience] = useState("");
  const [otherSpecialty, setOtherSpecialty] = useState("");

  // Step 4: Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDoc>>({});

  // Step 5: Signature & agreement
  const [agreedClauses, setAgreedClauses] = useState<Record<number, boolean>>({});
  const [signatureName, setSignatureName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const STEPS = [
    { id: 0, title: "اختر تخصصك", icon: "grid" },
    { id: 1, title: "بياناتك الشخصية", icon: "user" },
    { id: 2, title: "مؤهلاتك المهنية", icon: "award" },
    { id: 3, title: "المستندات المطلوبة", icon: "file-text" },
    { id: 4, title: "الإقرار والتوقيع", icon: "check-square" },
  ];

  const allClausesAgreed =
    DISCLAIMER_CLAUSES.every((_, i) => agreedClauses[i]) &&
    signatureName.trim().length >= 3;

  async function pickDocument(docName: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets[0]) {
        setUploadedDocs((prev) => ({
          ...prev,
          [docName]: {
            name: docName,
            uri: result.assets[0].uri,
            status: "uploaded",
          },
        }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      setUploadedDocs((prev) => ({
        ...prev,
        [docName]: { name: docName, status: "uploaded" },
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  function canProceed(): boolean {
    switch (currentStep) {
      case 0:
        return selectedSpecialty !== null;
      case 1:
        return (
          fullName.trim().length >= 3 &&
          nationalId.trim().length >= 10 &&
          phone.trim().length >= 10
        );
      case 2:
        return licenseNumber.trim().length >= 3 && experience.trim().length >= 1;
      case 3: {
        const requiredDocs = selectedSpecialty?.docs ?? [];
        return requiredDocs.every((d) => uploadedDocs[d]?.status === "uploaded");
      }
      case 4:
        return allClausesAgreed;
      default:
        return false;
    }
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setCurrentStep((s) => s + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    if (!allClausesAgreed) return;
    setSubmitting(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setUserProfile({
      name: fullName,
      phone,
      specialty: selectedSpecialty?.name,
      experience,
      licenseNumber,
    });
    await setUserRole("doctor");
    Alert.alert(
      "تم تقديم طلبك بنجاح",
      "سيتم مراجعة بياناتك ومستنداتك من قِبل فريقنا خلال 24-48 ساعة. ستصلك رسالة على جوالك عند الموافقة على طلبك.",
      [
        {
          text: "حسناً",
          onPress: () => router.replace("/(doctor)/dashboard"),
        },
      ]
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerBar: {
      paddingTop: topPad + 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.dark,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
    },
    stepCounter: {
      fontSize: 12,
      color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular",
    },
    progressTrack: {
      height: 4,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: 4,
      backgroundColor: colors.accent,
      borderRadius: 2,
    },
    stepsRow: {
      flexDirection: "row",
      marginTop: 16,
      gap: 6,
    },
    stepDot: {
      flex: 1,
      height: 3,
      borderRadius: 2,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: bottomPad + 120,
    },
    stepTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 6,
      marginTop: 4,
    },
    stepSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      lineHeight: 22,
      marginBottom: 24,
    },
    // Specialty grid
    specialtyGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    specialtyCard: {
      width: "47%",
      borderRadius: colors.radius + 2,
      borderWidth: 2,
      padding: 16,
      alignItems: "center",
      gap: 10,
    },
    specialtyIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    specialtyName: {
      fontSize: 14,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
      textAlign: "center",
      lineHeight: 20,
    },
    specialtyNameEn: {
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    // Form fields
    fieldLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 8,
      textAlign: "right",
    },
    fieldRequired: {
      color: colors.destructive,
    },
    input: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
      textAlign: "right",
      backgroundColor: colors.card,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    fieldHint: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginTop: -10,
      marginBottom: 16,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 20,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      textAlign: "right",
      marginBottom: 16,
    },
    // Document cards
    docCard: {
      borderRadius: colors.radius + 2,
      borderWidth: 1.5,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    docIconBox: {
      width: 46,
      height: 46,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },
    docInfo: {
      flex: 1,
      alignItems: "flex-end",
    },
    docName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 2,
    },
    docStatus: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
    },
    docActionBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: colors.radius - 2,
    },
    docActionText: {
      fontSize: 12,
      fontFamily: "Inter_700Bold",
    },
    optionalDocNote: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 12,
    },
    // Disclaimer
    disclaimerBox: {
      backgroundColor: colors.muted,
      borderRadius: colors.radius + 2,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    disclaimerTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      textAlign: "right",
      marginBottom: 12,
    },
    disclaimerIntro: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      lineHeight: 22,
      marginBottom: 16,
    },
    clauseRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 14,
    },
    clauseCheckbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
      flexShrink: 0,
    },
    clauseText: {
      flex: 1,
      fontSize: 13,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      lineHeight: 22,
      textAlign: "right",
    },
    sigBox: {
      borderWidth: 2,
      borderColor: colors.primary,
      borderRadius: colors.radius + 2,
      borderStyle: "dashed",
      padding: 16,
      marginBottom: 16,
    },
    sigLabel: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "right",
      marginBottom: 8,
    },
    sigInput: {
      fontSize: 18,
      color: colors.dark,
      fontFamily: "Inter_700Bold",
      textAlign: "center",
      paddingVertical: 8,
      borderBottomWidth: 1.5,
      borderBottomColor: colors.primary,
    },
    sigDate: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      marginTop: 8,
    },
    legalNote: {
      backgroundColor: "#FEF3C7",
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    legalNoteText: {
      fontSize: 12,
      color: "#92400E",
      fontFamily: "Inter_400Regular",
      lineHeight: 20,
      flex: 1,
      textAlign: "right",
    },
    // Bottom action bar
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: 20,
      paddingBottom: bottomPad + 16,
      paddingTop: 16,
    },
    bottomBtns: {
      flexDirection: "row",
      gap: 12,
    },
    backStepBtn: {
      width: 50,
      height: 50,
      borderRadius: colors.radius,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    nextBtn: {
      flex: 1,
      height: 50,
      backgroundColor: colors.dark,
      borderRadius: colors.radius,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    nextBtnDisabled: {
      opacity: 0.4,
    },
    nextBtnText: {
      color: "#FFF",
      fontSize: 16,
      fontFamily: "Inter_700Bold",
    },
    submitBtn: {
      flex: 1,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    submitBtnDisabled: {
      opacity: 0.4,
    },
    infoCard: {
      backgroundColor: colors.primaryLight,
      borderRadius: colors.radius,
      padding: 14,
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    infoText: {
      fontSize: 13,
      color: colors.dark,
      fontFamily: "Inter_400Regular",
      lineHeight: 20,
      flex: 1,
      textAlign: "right",
    },
  });

  const today = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text style={styles.stepTitle}>اختر تخصصك الطبي</Text>
            <Text style={styles.stepSubtitle}>
              حدد مجالك المهني لمعرفة المتطلبات والوثائق اللازمة للانضمام
            </Text>
            <View style={styles.specialtyGrid}>
              {SPECIALTIES.map((sp) => {
                const isSelected = selectedSpecialty?.id === sp.id;
                return (
                  <Pressable
                    key={sp.id}
                    style={[
                      styles.specialtyCard,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryLight
                          : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedSpecialty(sp);
                    }}
                  >
                    <View
                      style={[
                        styles.specialtyIcon,
                        {
                          backgroundColor: isSelected
                            ? colors.primary
                            : colors.muted,
                        },
                      ]}
                    >
                      <Feather
                        name={sp.icon as any}
                        size={22}
                        color={isSelected ? "#FFF" : colors.mutedForeground}
                      />
                    </View>
                    <Text
                      style={[
                        styles.specialtyName,
                        {
                          color: isSelected ? colors.primary : colors.foreground,
                        },
                      ]}
                    >
                      {sp.name}
                    </Text>
                    <Text
                      style={[
                        styles.specialtyNameEn,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {sp.nameEn}
                    </Text>
                    {isSelected && (
                      <View
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: colors.primary,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather name="check" size={12} color="#FFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            {selectedSpecialty && (
              <View style={[styles.infoCard, { marginTop: 20 }]}>
                <Feather name="info" size={16} color={colors.dark} />
                <Text style={styles.infoText}>
                  ستحتاج لرفع: {selectedSpecialty.docs.join("، ")}
                </Text>
              </View>
            )}
          </View>
        );

      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>بياناتك الشخصية</Text>
            <Text style={styles.stepSubtitle}>
              يُرجى إدخال بياناتك الشخصية الصحيحة كما تظهر في الهوية الوطنية
            </Text>

            <Text style={styles.fieldLabel}>
              الاسم الكامل <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="الاسم الرباعي كما في الهوية"
              placeholderTextColor={colors.mutedForeground}
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.fieldLabel}>
              رقم الهوية الوطنية <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="10 أرقام"
              placeholderTextColor={colors.mutedForeground}
              value={nationalId}
              onChangeText={setNationalId}
              keyboardType="numeric"
              maxLength={10}
            />

            <Text style={styles.fieldLabel}>
              رقم الجوال <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="05xxxxxxxx"
              placeholderTextColor={colors.mutedForeground}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>
              المدينة <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: الرياض، جدة، الدمام"
              placeholderTextColor={colors.mutedForeground}
              value={city}
              onChangeText={setCity}
            />

            <View style={[styles.infoCard]}>
              <Feather name="shield" size={16} color={colors.dark} />
              <Text style={styles.infoText}>
                بياناتك محمية ومشفّرة ولن تُشارَك مع أي جهة خارجية. تُستخدم
                فقط للتحقق من هويتك.
              </Text>
            </View>
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>مؤهلاتك المهنية</Text>
            <Text style={styles.stepSubtitle}>
              أدخل بيانات ترخيصك وخبرتك المهنية
            </Text>

            {selectedSpecialty?.id === "other" && (
              <>
                <Text style={styles.fieldLabel}>
                  اسم التخصص <Text style={styles.fieldRequired}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="أدخل تخصصك الطبي"
                  placeholderTextColor={colors.mutedForeground}
                  value={otherSpecialty}
                  onChangeText={setOtherSpecialty}
                />
              </>
            )}

            <Text style={styles.fieldLabel}>
              رقم رخصة مزاولة المهنة <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="أدخل رقم الرخصة"
              placeholderTextColor={colors.mutedForeground}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
            />

            <Text style={styles.fieldLabel}>جهة إصدار الترخيص</Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: هيئة التخصصات الصحية"
              placeholderTextColor={colors.mutedForeground}
              value={licenseAuthority}
              onChangeText={setLicenseAuthority}
            />

            <Text style={styles.fieldLabel}>
              سنوات الخبرة <Text style={styles.fieldRequired}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: 5"
              placeholderTextColor={colors.mutedForeground}
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.fieldHint}>إجمالي سنوات الخبرة العملية</Text>
          </View>
        );

      case 3: {
        const requiredDocs = selectedSpecialty?.docs ?? [];
        const optionalDocs = ["السيرة الذاتية (اختياري)", "شهادات إضافية (اختياري)"];
        return (
          <View>
            <Text style={styles.stepTitle}>رفع المستندات</Text>
            <Text style={styles.stepSubtitle}>
              يُرجى رفع المستندات المطلوبة بصور واضحة وصالحة
            </Text>

            <View style={[styles.infoCard]}>
              <Feather name="info" size={16} color={colors.dark} />
              <Text style={styles.infoText}>
                تأكد أن المستندات واضحة وغير منتهية الصلاحية. الصيغ المقبولة: صور
                JPG أو PNG بجودة عالية.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>مستندات إلزامية</Text>

            {requiredDocs.map((doc) => {
              const uploaded = uploadedDocs[doc];
              return (
                <View
                  key={doc}
                  style={[
                    styles.docCard,
                    {
                      backgroundColor: uploaded ? colors.mintLight : colors.card,
                      borderColor: uploaded ? colors.mint : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.docIconBox,
                      {
                        backgroundColor: uploaded
                          ? colors.mint + "30"
                          : colors.muted,
                      },
                    ]}
                  >
                    <Feather
                      name={uploaded ? "check-circle" : "file"}
                      size={22}
                      color={uploaded ? colors.dark : colors.mutedForeground}
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc}</Text>
                    <Text
                      style={[
                        styles.docStatus,
                        {
                          color: uploaded ? colors.dark : colors.mutedForeground,
                        },
                      ]}
                    >
                      {uploaded ? "تم الرفع بنجاح" : "لم يُرفع بعد"}
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.docActionBtn,
                      {
                        backgroundColor: uploaded
                          ? colors.muted
                          : colors.primary,
                      },
                    ]}
                    onPress={() => pickDocument(doc)}
                  >
                    <Text
                      style={[
                        styles.docActionText,
                        {
                          color: uploaded ? colors.mutedForeground : "#FFF",
                        },
                      ]}
                    >
                      {uploaded ? "تغيير" : "رفع"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionLabel}>مستندات اختيارية</Text>
            <Text style={styles.optionalDocNote}>
              تزيد من فرص قبولك وتعزز ملفك المهني
            </Text>

            {optionalDocs.map((doc) => {
              const uploaded = uploadedDocs[doc];
              return (
                <View
                  key={doc}
                  style={[
                    styles.docCard,
                    {
                      backgroundColor: uploaded ? colors.mintLight : colors.card,
                      borderColor: uploaded ? colors.mint : colors.border,
                      borderStyle: "dashed",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.docIconBox,
                      { backgroundColor: colors.muted },
                    ]}
                  >
                    <Feather
                      name={uploaded ? "check-circle" : "plus"}
                      size={22}
                      color={
                        uploaded ? colors.dark : colors.mutedForeground
                      }
                    />
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docName}>{doc}</Text>
                    <Text
                      style={[styles.docStatus, { color: colors.mutedForeground }]}
                    >
                      {uploaded ? "تم الرفع" : "اختياري"}
                    </Text>
                  </View>
                  <Pressable
                    style={[
                      styles.docActionBtn,
                      { backgroundColor: colors.muted },
                    ]}
                    onPress={() => pickDocument(doc)}
                  >
                    <Text
                      style={[
                        styles.docActionText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {uploaded ? "تغيير" : "إضافة"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        );
      }

      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>إقرار المسؤولية والتوقيع</Text>
            <Text style={styles.stepSubtitle}>
              يُرجى قراءة بنود الإقرار بعناية والموافقة عليها جميعاً قبل تقديم
              طلبك
            </Text>

            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerTitle}>
                إقرار مزود الخدمة الطبية
              </Text>
              <Text style={styles.disclaimerIntro}>
                أنا{" "}
                <Text style={{ fontFamily: "Inter_700Bold", color: colors.dark }}>
                  {fullName || "________"}
                </Text>
                ، بصفتي مزود خدمة طبية على منصة طبيبك، أُقرّ وأتعهد بما يلي:
              </Text>

              {DISCLAIMER_CLAUSES.map((clause, i) => (
                <Pressable
                  key={i}
                  style={styles.clauseRow}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setAgreedClauses((prev) => ({
                      ...prev,
                      [i]: !prev[i],
                    }));
                  }}
                >
                  <Text style={styles.clauseText}>{clause}</Text>
                  <View
                    style={[
                      styles.clauseCheckbox,
                      {
                        backgroundColor: agreedClauses[i]
                          ? colors.primary
                          : colors.background,
                        borderColor: agreedClauses[i]
                          ? colors.primary
                          : colors.mutedForeground,
                      },
                    ]}
                  >
                    {agreedClauses[i] && (
                      <Feather name="check" size={13} color="#FFF" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <View style={styles.legalNote}>
              <Feather name="alert-triangle" size={16} color="#D97706" />
              <Text style={styles.legalNoteText}>
                تنبيه قانوني: منصة طبيبك وسيط تقني فقط. لا تتحمل المنصة أي
                مسؤولية قانونية أو مالية أو طبية تجاه أي طرف ثالث نتيجة
                الخدمات المقدمة من خلالها. إدارة المنصة لا علاقة لها بما يجري
                بين مزود الخدمة والمريض.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>التوقيع الإلكتروني</Text>
            <View style={styles.sigBox}>
              <Text style={styles.sigLabel}>
                اكتب اسمك الكامل كتوقيع إلكتروني للإقرار بما سبق
              </Text>
              <TextInput
                style={styles.sigInput}
                placeholder="اكتب اسمك هنا..."
                placeholderTextColor={colors.mutedForeground}
                value={signatureName}
                onChangeText={setSignatureName}
                textAlign="center"
              />
              <Text style={styles.sigDate}>التاريخ: {today}</Text>
            </View>

            <View style={[styles.infoCard]}>
              <Feather name="lock" size={16} color={colors.dark} />
              <Text style={styles.infoText}>
                يُعدّ هذا الإقرار ملزماً قانونياً بموجب أنظمة التوقيع
                الإلكتروني في المملكة العربية السعودية. يُحفظ توقيعك
                الإلكتروني مع طلبك.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  }

  const progressPct = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.headerRow}>
          <Text style={styles.stepCounter}>
            {currentStep + 1} / {STEPS.length}
          </Text>
          <Text style={styles.headerTitle}>
            {STEPS[currentStep].title}
          </Text>
          <Pressable
            style={styles.backBtn}
            onPress={() => {
              if (currentStep === 0) {
                router.back();
              } else {
                prevStep();
              }
            }}
          >
            <Feather name="arrow-right" size={18} color="#FFF" />
          </Pressable>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPct}%` }]}
          />
        </View>

        {/* Step dots */}
        <View style={styles.stepsRow}>
          {STEPS.map((s) => (
            <View
              key={s.id}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    s.id <= currentStep
                      ? colors.accent
                      : "rgba(255,255,255,0.25)",
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBtns}>
          {currentStep > 0 && (
            <Pressable style={styles.backStepBtn} onPress={prevStep}>
              <Feather
                name="arrow-right"
                size={20}
                color={colors.foreground}
              />
            </Pressable>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Pressable
              style={[
                styles.nextBtn,
                !canProceed() && styles.nextBtnDisabled,
              ]}
              onPress={nextStep}
              disabled={!canProceed()}
            >
              <Text style={styles.nextBtnText}>التالي</Text>
              <Feather name="arrow-left" size={18} color="#FFF" />
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.submitBtn,
                (!allClausesAgreed || submitting) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!allClausesAgreed || submitting}
            >
              <Feather name="check-circle" size={18} color="#FFF" />
              <Text style={styles.nextBtnText}>
                {submitting ? "جارٍ التقديم..." : "تقديم طلب الانضمام"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
