"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";

const DEFAULT_OTP_LENGTH = 5;

type OtpCodeInputProps = {
  value: string[];
  onChange: (nextValue: string[]) => void;
  onComplete?: (code: string) => void;
  loading?: boolean;
  error?: boolean;
  isActive?: boolean;
  otpLength?: number;
};

function toEnglishDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 1584));
}

export function OtpCodeInput({
  value,
  onChange,
  onComplete,
  loading = false,
  error = false,
  isActive = false,
  otpLength = DEFAULT_OTP_LENGTH,
}: OtpCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    window.setTimeout(() => {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }, 0);
  };

  useEffect(() => {
    if (!isActive) return;
    window.setTimeout(() => {
      focusInput(0);
    }, 0);
  }, [isActive]);

  const emitChange = (nextValue: string[]) => {
    onChange(nextValue);
    const code = nextValue.join("");
    if (
      onComplete &&
      code.length === otpLength &&
      nextValue.every((digit) => Boolean(digit)) &&
      !loading
    ) {
      window.setTimeout(() => {
        onComplete(code);
      }, 0);
    }
  };

  const handleChange = (index: number, rawValue: string) => {
    const digits = toEnglishDigits(rawValue).replace(/\D/g, "").slice(0, otpLength).split("");

    if (digits.length > 1) {
      const next = [...value];
      digits.slice(0, otpLength - index).forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      emitChange(next);
      focusInput(Math.min(index + digits.length, otpLength - 1));
      return;
    }

    const next = [...value];
    next[index] = digits[0] ?? "";
    emitChange(next);

    if (digits[0] && index < otpLength - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      event.preventDefault();
      const next = [...value];
      next[index - 1] = "";
      onChange(next);
      focusInput(index - 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = toEnglishDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, otpLength)
      .split("");
    if (digits.length === 0) return;

    const next = [...value];
    digits.slice(0, otpLength - index).forEach((digit, offset) => {
      next[index + offset] = digit;
    });
    emitChange(next);
    focusInput(Math.min(index + digits.length, otpLength - 1));
  };

  return (
    <div dir="ltr" className="mx-auto flex w-fit items-center justify-center gap-2.5 sm:gap-4">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          data-otp-input={index === 0 ? "true" : undefined}
          aria-label={`رقم ${index + 1} کد تایید`}
          className={`h-14 w-12 shrink-0 rounded-2xl border bg-[#3b1f70]/95 text-center text-xl font-bold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)] outline-none transition-all placeholder:text-white/50 focus:ring-2 focus:ring-[#8b5cf6]/45 sm:h-14 sm:w-14 sm:text-xl ${
            error
              ? "border-red-500"
              : "border-white/15 focus:border-[#8b5cf6]/70"
          }`}
          value={digit}
          disabled={loading}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
        />
      ))}
    </div>
  );
}
