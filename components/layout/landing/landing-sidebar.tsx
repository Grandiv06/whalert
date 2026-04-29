"use client";

import { navLinks } from "@/config/landing-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { animate } from "framer-motion";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, X } from "lucide-react";
import { UserIcon } from "@/components/icons/landing-icons";

interface LandingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
}

export function LandingSidebar({ isOpen, onClose, isLoggedIn = false }: LandingSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSmoothNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) {
      onClose();
      return;
    }
    event.preventDefault();

    const hash = href.split("#")[1];
    if (!hash) {
      onClose();
      return;
    }

    if (pathname !== "/") {
      onClose();
      router.push(href);
      return;
    }

    const target = document.getElementById(hash);
    onClose();
    if (!target) return;

    const headerOffset = 120;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;

    animate(window.scrollY, Math.max(0, targetY), {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
  };

  return (
    <>
      <div
        role="presentation"
        aria-hidden={!isOpen}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-modal="true"
        aria-label="منوی ناوبری"
        role="dialog"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[min(85vw,320px)] max-w-[320px]",
          "flex flex-col overflow-hidden",
          "bg-[#02000a]/95 border-gradient-sidebar shadow-2xl",
          "transition-transform duration-300 ease-out",
          "border-l border-[#542C85]/30",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6 pb-4 border-b border-[#542C85]/20">
          <Link href="/" onClick={onClose} className="flex items-center shrink-0">
            <Image src="/whalert.svg" alt="لوگو" width={120} height={120} />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن منو"
            className="p-2 rounded-full text-white hover:bg-[#542C85]/50 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => handleSmoothNavigate(event, link.href)}
                    className={cn(
                      "block w-full rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                      isActive
                        ? "bg-[#542C85]/40 text-white border border-[#542C85]/30"
                        : "text-white/70 hover:text-white hover:bg-[#542C85]/30"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 p-4 pt-2 border-t border-[#542C85]/20">
          {isLoggedIn ? (
            <Button
              onClick={() => {
                onClose();
                router.push("/dashboard");
              }}
              className="w-full justify-center gap-2 h-12 rounded-full bg-[#542C85] hover:bg-[#542C85]/90 text-white"
            >
              <LayoutDashboard size={20} className="text-white" />
              پنل کاربری
            </Button>
          ) : (
            <div className="w-full h-12 rounded-full bg-[#542C85] flex items-center justify-center gap-2 px-2">
              <UserIcon size={20} className="text-white" />
              <Link
                href="/auth/sign-in"
                onClick={onClose}
                className="text-sm text-white"
              >
                ورود
              </Link>
              <span className="text-white/40">|</span>
              <Link
                href="/auth/sign-up"
                onClick={onClose}
                className="text-sm text-white"
              >
                ثبت‌نام
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
