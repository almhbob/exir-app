export type RemoteUser = {
  id: string;
  phone: string;
  email: string | null;
  fullName: string;
  role: "patient" | "doctor" | "admin";
  status: string;
  isPhoneVerified: boolean;
};

export type DemoLoginResponse = {
  user: RemoteUser;
};

function getApiBaseUrl(): string | null {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL;
  if (explicitUrl) return explicitUrl.replace(/\/+$/, "");

  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`.replace(/\/+$/, "");

  return null;
}

export function isRemoteApiEnabled(): boolean {
  return process.env.EXPO_PUBLIC_USE_REMOTE_API === "true";
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function demoLogin(phone: string, fullName?: string): Promise<DemoLoginResponse> {
  return apiFetch<DemoLoginResponse>("/api/auth/demo-login", {
    method: "POST",
    body: JSON.stringify({
      phone,
      fullName: fullName || "مستخدم إكسير",
      role: "patient",
    }),
  });
}
