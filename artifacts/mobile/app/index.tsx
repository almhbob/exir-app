import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";

export default function RootIndex() {
  const { userRole } = useApp();

  if (!userRole) {
    return <Redirect href="/onboarding" />;
  }

  if (userRole === "patient") {
    return <Redirect href="/(patient)/home" />;
  }

  return <Redirect href="/(doctor)/dashboard" />;
}
