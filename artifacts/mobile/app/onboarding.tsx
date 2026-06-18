import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
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

type Step = "role" | "profile";

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUserRole, setUserProfile } = useApp();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  async function handleRoleSelect(role: "patient" | "doctor") {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(role);
  }

  async function handleContinue() {
    if (!selectedRole) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("profile");
  }

  async function handleStart() {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setUserProfile({
      name: name.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
    });
    await setUserRole(selectedRole!);
    router.replace(selectedRole === "patient" ? "/(patient)/home" : "/(doctor)/dashboard");
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingTop: topPad + 20,
      paddingHorizontal: 24,
      paddingBottom: bottomPad + 20,
      minHeight: "100%",
    },
    logo: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: colors.dark,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 24,
      marginBottom: 40,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 16,
    },
    roleCard: {
      borderRadius: colors.radius + 4,
      borderWidth: 2,
      padding: 20,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    roleIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    roleTitle: {
      fontSize: 18,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    roleDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 18,
    },
    checkMark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
    },
    continueBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 32,
    },
    continueBtnDisabled: {
      opacity: 0.4,
    },
    continueBtnText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
    },
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 32,
    },
    backText: {
      fontSize: 15,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 8,
    },
    input: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      backgroundColor: colors.card,
      marginBottom: 16,
      textAlign: "right",
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    featureDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    featureText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });

  if (step === "profile") {
    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Pressable style={styles.backBtn} onPress={() => setStep("role")}>
            <Feather name="arrow-left" size={20} color={colors.primary} />
            <Text style={styles.backText}>رجوع</Text>
          </Pressable>

          <View style={styles.logo}>
            <Feather
              name={selectedRole === "doctor" ? "briefcase" : "user"}
              size={28}
              color="#FFF"
            />
          </View>

          <Text style={styles.title}>
            {selectedRole === "patient" ? "مرحباً بك" : "انضم كمختص"}
          </Text>
          <Text style={styles.subtitle}>
            {selectedRole === "patient"
              ? "أدخل بياناتك للحصول على أفضل رعاية صحية منزلية"
              : "انضم لآلاف الأطباء والمختصين الذين يعملون معنا"}
          </Text>

          <Text style={styles.inputLabel}>الاسم الكامل</Text>
          <TextInput
            style={styles.input}
            placeholder="أدخل اسمك الكامل"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.inputLabel}>رقم الجوال</Text>
          <TextInput
            style={styles.input}
            placeholder="05xxxxxxxx"
            placeholderTextColor={colors.mutedForeground}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {selectedRole === "doctor" && (
            <>
              <Text style={styles.inputLabel}>التخصص الطبي</Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: طب عام، طب الأطفال..."
                placeholderTextColor={colors.mutedForeground}
                value={specialty}
                onChangeText={setSpecialty}
              />
            </>
          )}

          <Pressable
            style={[
              styles.continueBtn,
              (!name.trim() || !phone.trim()) && styles.continueBtnDisabled,
            ]}
            onPress={handleStart}
            disabled={!name.trim() || !phone.trim() || loading}
          >
            <Text style={styles.continueBtnText}>ابدأ الآن</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <Feather name="plus-circle" size={30} color="#FFF" />
        </View>

        <Text style={styles.title}>طبيبك</Text>
        <Text style={styles.subtitle}>
          منصة الرعاية الصحية المنزلية — طبيبك يحضر إليك أينما كنت
        </Text>

        <Text style={styles.sectionLabel}>أنا...</Text>

        <Pressable
          style={[
            styles.roleCard,
            {
              backgroundColor:
                selectedRole === "patient" ? colors.primaryLight : colors.card,
              borderColor:
                selectedRole === "patient" ? colors.primary : colors.border,
            },
          ]}
          onPress={() => handleRoleSelect("patient")}
        >
          <View
            style={[
              styles.roleIcon,
              {
                backgroundColor:
                  selectedRole === "patient"
                    ? colors.primary
                    : colors.muted,
              },
            ]}
          >
            <Feather
              name="user"
              size={24}
              color={selectedRole === "patient" ? "#FFF" : colors.mutedForeground}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.roleTitle,
                { color: selectedRole === "patient" ? colors.primary : colors.foreground },
              ]}
            >
              مريض / أحتاج طبيباً
            </Text>
            <Text style={styles.roleDesc}>
              احجز طبيباً أو مختصاً لزيارتك في أي وقت
            </Text>
          </View>
          {selectedRole === "patient" && (
            <View
              style={[
                styles.checkMark,
                { backgroundColor: colors.primary },
              ]}
            >
              <Feather name="check" size={14} color="#FFF" />
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.roleCard,
            {
              backgroundColor:
                selectedRole === "doctor" ? colors.primaryLight : colors.card,
              borderColor:
                selectedRole === "doctor" ? colors.primary : colors.border,
            },
          ]}
          onPress={() => handleRoleSelect("doctor")}
        >
          <View
            style={[
              styles.roleIcon,
              {
                backgroundColor:
                  selectedRole === "doctor" ? colors.primary : colors.muted,
              },
            ]}
          >
            <Feather
              name="briefcase"
              size={24}
              color={selectedRole === "doctor" ? "#FFF" : colors.mutedForeground}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.roleTitle,
                { color: selectedRole === "doctor" ? colors.primary : colors.foreground },
              ]}
            >
              طبيب / مختص طبي
            </Text>
            <Text style={styles.roleDesc}>
              انضم وابدأ بتقديم خدماتك الطبية المنزلية
            </Text>
          </View>
          {selectedRole === "doctor" && (
            <View
              style={[
                styles.checkMark,
                { backgroundColor: colors.primary },
              ]}
            >
              <Feather name="check" size={14} color="#FFF" />
            </View>
          )}
        </Pressable>

        <View style={{ marginTop: 32 }}>
          {[
            "زيارات منزلية في غضون 60 دقيقة",
            "أكثر من 500 طبيب ومختص موثق",
            "توصيل الأدوية لباب المنزل",
            "فرص عمل للكوادر الطبية",
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.continueBtn,
            !selectedRole && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.continueBtnText}>متابعة</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
