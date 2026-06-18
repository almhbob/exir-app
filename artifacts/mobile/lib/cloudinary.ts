const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export type CloudinaryFolder =
  | "akseer/documents"
  | "akseer/avatars"
  | "akseer/results"
  | "akseer/prescriptions";

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export class CloudinaryError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "CloudinaryError";
  }
}

export async function uploadToCloudinary(
  fileUri: string,
  folder: CloudinaryFolder = "akseer/documents",
  onProgress?: (p: UploadProgress) => void
): Promise<UploadResult> {
  if (!CLOUD_NAME) {
    throw new CloudinaryError("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }
  if (!UPLOAD_PRESET) {
    throw new CloudinaryError(
      "EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set"
    );
  }

  const formData = new FormData();

  const filename = fileUri.split("/").pop() ?? "upload";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = ext === "pdf" ? "application/pdf" : `image/${ext}`;

  formData.append("file", {
    uri: fileUri,
    name: filename,
    type: mimeType,
  } as unknown as Blob);

  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errMsg = `Upload failed (${response.status})`;
    try {
      const json = await response.json();
      errMsg = json.error?.message ?? errMsg;
    } catch {}
    throw new CloudinaryError(errMsg, response.status);
  }

  const data = await response.json();

  return {
    url: data.url,
    secureUrl: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
  };
}

export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "eco" | "good" | "best";
    format?: "auto" | "webp" | "jpg" | "png";
    crop?: "fill" | "fit" | "thumb" | "scale";
  } = {}
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  const transforms: string[] = [`q_${quality}`, `f_${format}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`;
}

export function getAvatarUrl(publicId: string, size = 200): string {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: "thumb",
    quality: "auto",
    format: "auto",
  });
}

export function isConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}
