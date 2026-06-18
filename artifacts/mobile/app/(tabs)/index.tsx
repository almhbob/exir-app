import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";

export default function TabsIndex() {
  const { userRole } = useApp();
  if (userRole === "doctor") return <Redirect href="/(doctor)/dashboard" />;
  return <Redirect href="/(patient)/home" />;
}
