import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "@/config/env";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS = 30;

let refreshPromise: Promise<string | null> | null = null;
let interceptorsInitialized = false;

type TokenResponse = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expireInSeconds?: number;
};

type ApiEnvelope<T> = {
  result?: T;
};

type RetriableAxiosRequestConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readStorage(key: string): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(key);
}

function writeStorage(key: string, value: string) {
  if (!isBrowser()) return;
  localStorage.setItem(key, value);
}

function removeStorage(key: string) {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

function parseJwtExpiration(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart || !isBrowser()) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(window.atob(padded)) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function shouldRefreshAccessToken(token: string): boolean {
  const exp = parseJwtExpiration(token);
  if (!exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp - now <= ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS;
}

function normalizeTokenResponse(response: unknown): TokenResponse {
  if (!response || typeof response !== "object") return {};
  const envelope = response as ApiEnvelope<TokenResponse>;
  if (envelope.result && typeof envelope.result === "object") {
    return envelope.result;
  }
  return response as TokenResponse;
}

export function storeAuthSession(data: TokenResponse): void {
  if (!isBrowser()) return;
  if (data.accessToken) {
    writeStorage(ACCESS_TOKEN_KEY, data.accessToken);
    setAuthCookie(data.accessToken, data.expireInSeconds ?? 60 * 60 * 24 * 7);
  }
  if (data.refreshToken) {
    writeStorage(REFRESH_TOKEN_KEY, data.refreshToken);
  }
}

export function clearAuthSession(): void {
  removeStorage(ACCESS_TOKEN_KEY);
  removeStorage(REFRESH_TOKEN_KEY);
  clearAuthCookie();
}

async function requestRefreshToken(refreshToken: string): Promise<TokenResponse> {
  const url = `${getApiBaseUrl()}/api/TokenAuth/RefreshToken`;
  const response = await axios.post(url, null, {
    params: { refreshToken },
  });
  return normalizeTokenResponse(response.data);
}

export async function refreshAccessToken(): Promise<string | null> {
  if (!isBrowser()) return null;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = readStorage(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        clearAuthSession();
        return null;
      }

      try {
        const refreshed = await requestRefreshToken(refreshToken);
        if (!refreshed.accessToken) {
          clearAuthSession();
          if (isBrowser() && !window.location.pathname.startsWith("/auth/")) {
            window.location.href = "/auth/sign-in";
          }
          return null;
        }

        storeAuthSession({
          accessToken: refreshed.accessToken,
          expireInSeconds: refreshed.expireInSeconds,
        });
        return refreshed.accessToken;
      } catch {
        clearAuthSession();
        if (isBrowser() && !window.location.pathname.startsWith("/auth/")) {
          window.location.href = "/auth/sign-in";
        }
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function ensureValidAccessToken(): Promise<string | null> {
  const token = readStorage(ACCESS_TOKEN_KEY);
  if (!token) return refreshAccessToken();
  if (!shouldRefreshAccessToken(token)) return token;
  return refreshAccessToken();
}

export function initAuthSession(): void {
  if (!isBrowser() || interceptorsInitialized) return;
  interceptorsInitialized = true;

  axios.interceptors.request.use(async (config) => {
    const requestUrl = config.url ?? "";
    if (requestUrl.includes("/api/TokenAuth/RefreshToken")) return config;

    const token = await ensureValidAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableAxiosRequestConfig | undefined;
      const status = error.response?.status;
      const requestUrl = originalRequest?.url ?? "";

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        requestUrl.includes("/api/TokenAuth/RefreshToken")
      ) {
        if (status === 401 && isBrowser() && !window.location.pathname.startsWith("/auth/")) {
          clearAuthSession();
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (!newToken) {
        if (isBrowser() && !window.location.pathname.startsWith("/auth/")) {
          window.location.href = "/auth/sign-in";
        }
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization =
        `Bearer ${newToken}`;
      return axios.request(originalRequest);
    },
  );
}
