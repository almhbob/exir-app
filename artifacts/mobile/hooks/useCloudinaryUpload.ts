import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

import {
  CloudinaryError,
  CloudinaryFolder,
  UploadResult,
  uploadToCloudinary,
} from "@/lib/cloudinary";

export type UploadState =
  | { status: "idle" }
  | { status: "picking" }
  | { status: "uploading"; progress: number }
  | { status: "success"; result: UploadResult }
  | { status: "error"; message: string };

interface UseCloudinaryUploadOptions {
  folder?: CloudinaryFolder;
  mediaTypes?: ImagePicker.MediaTypeOptions;
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export function useCloudinaryUpload(options: UseCloudinaryUploadOptions = {}) {
  const {
    folder = "akseer/documents",
    mediaTypes = ImagePicker.MediaTypeOptions.Images,
    quality = 0.85,
    allowsEditing = false,
    aspect,
  } = options;

  const [state, setState] = useState<UploadState>({ status: "idle" });

  async function pick(): Promise<UploadResult | null> {
    setState({ status: "picking" });

    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        quality,
        allowsEditing,
        aspect,
      });

      if (pickerResult.canceled) {
        setState({ status: "idle" });
        return null;
      }

      const uri = pickerResult.assets[0].uri;
      setState({ status: "uploading", progress: 0 });

      // Simulate progress steps (Cloudinary doesn't give XHR-level progress via fetch)
      const progressTick = setInterval(() => {
        setState((prev) => {
          if (prev.status !== "uploading") return prev;
          const next = Math.min(prev.progress + 15, 85);
          return { status: "uploading", progress: next };
        });
      }, 300);

      try {
        const result = await uploadToCloudinary(uri, folder);
        clearInterval(progressTick);
        setState({ status: "uploading", progress: 100 });

        await new Promise((r) => setTimeout(r, 300));
        setState({ status: "success", result });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return result;
      } catch (err) {
        clearInterval(progressTick);
        const msg =
          err instanceof CloudinaryError
            ? err.message
            : "فشل الرفع، حاول مجدداً";
        setState({ status: "error", message: msg });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return null;
      }
    } catch {
      setState({ status: "idle" });
      return null;
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  const isLoading =
    state.status === "picking" || state.status === "uploading";
  const progress =
    state.status === "uploading" ? state.progress : undefined;
  const result =
    state.status === "success" ? state.result : undefined;
  const error =
    state.status === "error" ? state.message : undefined;

  return { state, pick, reset, isLoading, progress, result, error };
}
