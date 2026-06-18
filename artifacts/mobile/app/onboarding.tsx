import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Image,
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
    if (selectedRole === "doctor") {
      router.push("/join-request");
    } else {
      setStep("profile");
    }
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
    flex: { flex: 1 },
    bg: { flex: 1 },
    scroll: { flex: 1 },
    content: {
      paddingTop: topPad + 28,
      paddingHorizontal: 24,
      paddingBottom: bottomPad + 40,
      minHeight: "100%",
    },
    orb1: {
      position: "absolute",
      top: -80,
      right: -80,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: "rgba(37,156,244,0.22)",
    },
    orb2: {
      position: "absolute",
      bottom: 100,
      left: -60,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "rgba(29,208,248,0.15)",
    },
    orb3: {
      position: "absolute",
      top: "35%",
      left: "60%",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(92,234,210,0.12)",
    },
    logoBox: {
      width: 70,
      height: 70,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.18)",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.32)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 28,
    },
    logoImg: {
      width: 150,
      height: 120,
      alignSelf: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 34,
      fontWeight: "700",
      color: "#FFF",
      fontFamily: "Inter_700Bold",
      marginBottom: 10,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 15,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
      lineHeight: 24,
      marginBottom: 40,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: "rgba(255,255,255,0.6)",
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 14,
    },
    roleCard: {
      borderRadius: colors.radius + 4,
      borderWidth: 1.5,
      padding: 18,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    roleIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    roleTitle: {
      fontSize: 17,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
      marginBottom: 3,
      color: "#FFF",
    },
    roleDesc: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.65)",
      lineHeight: 18,
    },
    checkMark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    continueBtn: {
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 32,
      overflow: "hidden",
    },
    continueBtnDisabled: {
      opacity: 0.4,
    },
    continueBtnText: {
      color: colors.dark,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: "Inter_700Bold",
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 12,
    },
    featureDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: "rgba(92,234,210,0.9)",
    },
    featureText: {
      fontSize: 14,
      color: "rgba(255,255,255,0.75)",
      fontFamily: "Inter_400Regular",
    },
    // Profile step styles
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 32,
    },
    backText: {
      fontSize: 15,
      color: "rgba(255,255,255,0.9)",
      fontFamily: "Inter_500Medium",
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "rgba(255,255,255,0.9)",
      fontFamily: "Inter_600SemiBold",
      marginBottom: 8,
    },
    input: {
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.22)",
      borderRadius: colors.radius,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: "#FFF",
      fontFamily: "Inter_400Regular",
      backgroundColor: "rgba(255,255,255,0.1)",
      marginBottom: 16,
      textAlign: "right",
    },
  });

  if (step === "profile") {
    return (
      <View style={styles.flex}>
        <LinearGradient
          colors={["#001F3F", "#0E4D62", "#1A7066"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bg}
        >
          <View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]} pointerEvents="none">
            <View style={styles.orb1} />
            <View style={styles.orb2} />
            <View style={styles.orb3} />
          </View>
          <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <Pressable style={styles.backBtn} onPress={() => setStep("role")}>
                <Feather name="arrow-left" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.backText}>رجوع</Text>
              </Pressable>

              <View style={styles.logoBox}>
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
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>رقم الجوال</Text>
              <TextInput
                style={styles.input}
                placeholder="05xxxxxxxx"
                placeholderTextColor="rgba(255,255,255,0.4)"
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
                    placeholderTextColor="rgba(255,255,255,0.4)"
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
                <LinearGradient
                  colors={["#FFFFFF", "#E8F4FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
                />
                <Text style={styles.continueBtnText}>ابدأ الآن</Text>
              </Pressable>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <LinearGradient
        colors={["#001F3F", "#0E4D62", "#1A7066"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bg}
      >
        <View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]} pointerEvents="none">
          <View style={styles.orb1} />
          <View style={styles.orb2} />
          <View style={styles.orb3} />
        </View>
        <ScrollView style={styles.scroll}>
          <View style={styles.content}>
            <Image
              source={require("../assets/images/logo_transparent.png")}
              style={styles.logoImg}
              resizeMode="contain"
            />

            <Text style={styles.title}>اكسير</Text>
            <Text style={styles.subtitle}>
              منصة الرعاية الصحية المنزلية — اكسير يحضر إليك أينما كنت
            </Text>

            <Text style={styles.sectionLabel}>أنا...</Text>

            {[
              {
                role: "patient" as const,
                icon: "user",
                title: "مريض / أحتاج طبيباً",
                desc: "احجز طبيباً أو مختصاً لزيارتك في أي وقت",
              },
              {
                role: "doctor" as const,
                icon: "briefcase",
                title: "طبيب / مختص طبي",
                desc: "انضم وابدأ بتقديم خدماتك الطبية المنزلية",
              },
            ].map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <Pressable
                  key={item.role}
                  style={[
                    styles.roleCard,
                    {
                      backgroundColor: isSelected
                        ? "rgba(37,156,244,0.22)"
                        : "rgba(255,255,255,0.1)",
                      borderColor: isSelected
                        ? "rgba(37,156,244,0.7)"
                        : "rgba(255,255,255,0.2)",
                    },
                  ]}
                  onPress={() => handleRoleSelect(item.role)}
                >
                  <View
                    style={[
                      styles.roleIcon,
                      {
                        backgroundColor: isSelected
                          ? "rgba(37,156,244,0.35)"
                          : "rgba(255,255,255,0.12)",
                      },
                    ]}
                  >
                    <Feather
                      name={item.icon as any}
                      size={24}
                      color={isSelected ? "#FFF" : "rgba(255,255,255,0.75)"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.roleTitle}>{item.title}</Text>
                    <Text style={styles.roleDesc}>{item.desc}</Text>
                  </View>
                  {isSelected && (
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
              );
            })}

            <View style={{ marginTop: 28 }}>
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
              <LinearGradient
                colors={["#FFFFFF", "#E8F4FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: colors.radius }]}
              />
              <Text style={styles.continueBtnText}>متابعة</Text>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
