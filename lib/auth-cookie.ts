/**
 * Auth cookie helpers - used for middleware protection.
 * Token is also stored in localStorage for API client.
 */

export const AUTH_COOKIE_NAME = "accessToken";

/** Set auth cookie (client-side, call after successful login) */
export function setAuthCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

/** Clear auth cookie (client-side, call on logout) */
export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}
