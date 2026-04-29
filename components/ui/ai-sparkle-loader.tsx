"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AISparkleLoaderProps {
  text?: string;
  size?: number;
  className?: string;
  variant?: "inline" | "fullScreen";
}

const StarIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export function AISparkleLoader({
  text = "درحال پردازش...",
  size = 40,
  className,
  variant = "inline",
}: AISparkleLoaderProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6",
        className
      )}
    >
      <style>{`
        @keyframes premium-twinkle {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; filter: drop-shadow(0 0 5px currentColor); }
        }
        .star-premium { animation: premium-twinkle 2.5s ease-in-out infinite; }
      `}</style>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size * 2.5, height: size * 2.5 }}
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">در حال پردازش...</span>
        <StarIcon
          className="text-[#542C85] star-premium absolute left-[15%] top-1/2 -translate-y-1/2"
          style={{ width: size, height: size }}
        />
        <StarIcon
          className="text-[#8445C2] star-premium absolute right-[15%] top-[15%]"
          style={{ width: size * 0.65, height: size * 0.65, animationDelay: "1.2s" }}
        />
        <StarIcon
          className="text-[#DCA0FF] star-premium absolute right-[25%] bottom-[20%]"
          style={{ width: size * 0.45, height: size * 0.45, animationDelay: "0.6s" }}
        />
      </div>
      {text && (
        <p className="text-sm font-bold text-[#542C85] animate-pulse whitespace-nowrap">
          {text}
        </p>
      )}
    </div>
  );

  if (variant === "fullScreen") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm pointer-events-none">
        {content}
      </div>
    );
  }
  return content;
}
