export function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1584));
}

/** Keeps only digits while typing; normalizes common Iran prefixes to 09xxxxxxxxx */
export function sanitizeIranMobileInput(value: string) {
  let digits = toEnglishDigits(value).replace(/\D/g, "");

  if (digits.startsWith("0098")) {
    digits = digits.slice(4);
  } else if (digits.startsWith("98") && digits.length > 10) {
    digits = digits.slice(2);
  }

  if (digits.length === 10 && digits.startsWith("9")) {
    digits = `0${digits}`;
  }

  if (digits.startsWith("09")) {
    return digits.slice(0, 11);
  }

  return digits.slice(0, 11);
}

export function formatIranMobileForApi(value: string): string | null {
  const phone = sanitizeIranMobileInput(value);
  return /^09\d{9}$/.test(phone) ? phone : null;
}

export function normalizeOtp(value: string) {
  return toEnglishDigits(value).replace(/\D/g, "");
}
