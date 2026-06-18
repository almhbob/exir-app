import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MOCK_OTP = "1234";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login, userRole } = useApp();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const topPad = Platform.OS === "web" ? 20 : insets.top;

  function handlePhoneSubmit() {
    const clean = phone.replace(/\s/g, "");
    if (clean.length < 9) {
      setError("أدخل رقم جوال صحيح");
      return;
    }
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("otp");
  }

  function handleOtpChange(val: string, idx: number) {
    if (!/^\d*$/.test(val)) return;
    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);
    if (val && idx < 3) {
      otpRefs[idx + 1].current?.focus();
    }
    if (updated.every((d) => d !== "")) {
      verifyOtp(updated.join(""));
    }
  }

  function handleOtpKeyPress(key: string, idx: number) {
    if (key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  }

  async function verifyOtp(code: string) {
    if (code !== MOCK_OTP) {
      setError("رمز التحقق غير صحيح. استخدم: " + MOCK_OTP);
      setOtp(["", "", "", ""]);
      otpRefs[0].current?.focus();
      return;
    }
    setError("");
    setLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await login(phone);
    setLoading(false);
    if (userRole) {
      router.replace(userRole === "patient" ? "/(patient)/home" : "/(doctor)/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { flex: 1, paddingTop: topPad },
    backBtn: {
      width: 42, height: 42, borderRadius: 21,
      backgroundColor: "rgba(255,255,255,0.13)",
      borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
      alignItems: "center", justifyContent: "center",
      margin: 20, alignSelf: "flex-end",
    },
    hero: { paddingHorizontal: 28, paddingBottom: 40, paddingTop: 10 },
    logoImg: {
      width: 160, height: 130,
      alignSelf: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 28, fontWeight: "700",
      color: "#FFF", fontFamily: "Inter_700Bold",
      letterSpacing: -0.5, textAlign: "right",
      marginBottom: 6,
    },
    sub: {
      fontSize: 15, color: "rgba(255,255,255,0.7)",
      fontFamily: "Inter_400Regular", textAlign: "right",
      lineHeight: 22,
    },
    card: {
      flex: 1,
      backgroundColor: colors.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: 28,
      paddingTop: 32,
    },
    inputLabel: {
      fontSize: 13, color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold", textAlign: "right",
      marginBottom: 8,
      textTransform: "uppercase", letterSpacing: 0.5,
    },
    phoneRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: colors.border,
      marginBottom: 8,
      overflow: "hidden",
    },
    countryCode: {
      paddingHorizontal: 16, paddingVertical: 16,
      borderRightWidth: 1, borderRightColor: colors.border,
      flexDirection: "row", alignItems: "center", gap: 6,
    },
    countryCodeText: {
      fontSize: 15, fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    phoneInput: {
      flex: 1, paddingHorizontal: 16, paddingVertical: 16,
      fontSize: 16, fontFamily: "Inter_400Regular",
      color: colors.foreground, textAlign: "right",
    },
    hint: {
      fontSize: 12, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "right",
      marginBottom: 24,
    },
    hintHighlight: { color: colors.primary, fontFamily: "Inter_700Bold" },

    // OTP
    otpTitle: {
      fontSize: 18, fontWeight: "700",
      color: colors.foreground, fontFamily: "Inter_700Bold",
      textAlign: "right", marginBottom: 6,
    },
    otpSub: {
      fontSize: 14, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "right",
      marginBottom: 28,
    },
    otpRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginBottom: 8,
    },
    otpBox: {
      width: 64, height: 68,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      alignItems: "center", justifyContent: "center",
    },
    otpBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
    otpInput: {
      fontSize: 26, fontFamily: "Inter_700Bold",
      color: colors.foreground, textAlign: "center",
      width: "100%", height: "100%",
    },
    otpHint: {
      fontSize: 13, color: colors.mutedForeground,
      fontFamily: "Inter_400Regular", textAlign: "center",
      marginBottom: 24,
    },
    otpHintBold: { color: colors.primary, fontFamily: "Inter_700Bold" },
    resend: { alignItems: "center", marginTop: 16 },
    resendText: { fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    resendLink: { color: colors.primary, fontFamily: "Inter_700Bold" },

    error: {
      fontSize: 13, color: "#EF4444",
      fontFamily: "Inter_600SemiBold", textAlign: "center",
      marginBottom: 14,
      backgroundColor: "#FEF2F2",
      padding: 10, borderRadius: 10,
    },
    btn: {
      borderRadius: 16, paddingVertical: 17,
      alignItems: "center", overflow: "hidden",
      marginTop: 8,
    },
    btnText: {
      color: "#FFF", fontSize: 16,
      fontFamily: "Inter_700Bold", letterSpacing: 0.3,
    },
    loadingRow: { flexDirection: "row", gap: 6 },
    divider: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { fontSize: 12, color: colors.mutedForeground, fontFamily: "Inter_400Regular" },
    guestBtn: {
      borderRadius: 16, paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1.5, borderColor: colors.border,
    },
    guestText: {
      fontSize: 14, color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#051C2C", "#0E4D62", "#1A7066"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {step === "otp" && (
          <Pressable style={styles.backBtn} onPress={() => { setStep("phone"); setOtp(["","","",""]); setError(""); }}>
            <Feather name="arrow-right" size={20} color="#FFF" />
          </Pressable>
        )}

        <View style={styles.hero}>
          <Image
            source={require("../assets/images/logo_transparent.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {step === "phone" ? "أهلاً بك في اكسير" : "تحقق من رقمك"}
          </Text>
          <Text style={styles.sub}>
            {step === "phone"
              ? "أدخل رقم جوالك للمتابعة — صحتك أولويتنا"
              : `أرسلنا رمزاً لـ +249 ${phone}`}
          </Text>
        </View>

        <View style={styles.card}>
          {step === "phone" ? (
            <>
              <Text style={styles.inputLabel}>رقم الجوال</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text>🇸🇩</Text>
                  <Text style={styles.countryCodeText}>+249</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="5X XXX XXXX"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(t) => { setPhone(t); setError(""); }}
                  maxLength={10}
                  autoFocus
                />
              </View>
              <Text style={styles.hint}>
                رمز التحقق التجريبي: <Text style={styles.hintHighlight}>1234</Text>
              </Text>

              {!!error && <Text style={styles.error}>{error}</Text>}

              <Pressable style={styles.btn} onPress={handlePhoneSubmit}>
                <LinearGradient
                  colors={["#0E4D62", "#1A7066", "#1E8070"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: 16 }]}
                />
                <Text style={styles.btnText}>إرسال رمز التحقق</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>أو</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={styles.guestBtn}
                onPress={async () => {
                  await login("0500000000");
                  router.replace("/onboarding");
                }}
              >
                <Text style={styles.guestText}>تصفح كزائر</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.otpTitle}>أدخل رمز التحقق</Text>
              <Text style={styles.otpSub}>تحقق من رسائلك — الرمز صالح 10 دقائق</Text>

              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <View key={i} style={[styles.otpBox, digit && styles.otpBoxFilled]}>
                    <TextInput
                      ref={otpRefs[i]}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(v) => handleOtpChange(v, i)}
                      onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  </View>
                ))}
              </View>

              <Text style={styles.otpHint}>
                للتجربة: <Text style={styles.otpHintBold}>1234</Text>
              </Text>

              {!!error && <Text style={styles.error}>{error}</Text>}

              {loading && (
                <Text style={[styles.otpSub, { textAlign: "center" }]}>
                  جارٍ التحقق...
                </Text>
              )}

              <View style={styles.resend}>
                <Text style={styles.resendText}>
                  لم يصلك الرمز؟{" "}
                  <Text
                    style={styles.resendLink}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    أعد الإرسال
                  </Text>
                </Text>
              </View>
            </>
          )}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
