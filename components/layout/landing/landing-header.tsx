"use client";

import { MenuIcon, UserIcon } from "@/components/icons/landing-icons";
import { Button } from "@/components/landing/ui/button/button";
import { navLinks } from "@/config/landing-nav";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import { animate } from "framer-motion";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LandingSidebar } from "./landing-sidebar";

export function LandingHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    let observer: IntersectionObserver | null = null;

    const initObserver = () => {
      const observerOptions = {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      };

      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      observer = new IntersectionObserver(handleIntersection, observerOptions);

      const sectionIds = ["home", "services", "tools", "performance", "plans"];
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer?.observe(element);
      });
    };

    // Small delay to ensure all section elements are rendered/hydrated
    const timer = setTimeout(initObserver, 150);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [pathname]);

  const handleSmoothNavigate = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#") && href !== "/") return;
    
    if (href === "/") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    event.preventDefault();

    const hash = href.split("#")[1];
    if (!hash) return;

    if (pathname !== "/") {
      router.push(href);
      return;
    }

    const target = document.getElementById(hash);
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
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4 lg:pt-5 transition-all duration-500",
        )}
      >
        <div
          className={cn(
            "w-full max-w-[1440px] mx-auto max-h-[80px] h-fit header-pill transition-all duration-500",
            isScrolled
              ? "border-white/20 bg-[#110724]/92"
              : "shadow-none bg-[#1a0c35]/35",
          )}
        >
          <nav className="px-3 sm:px-4 md:px-5 lg:px-6 gap-3 sm:gap-4 lg:gap-6 flex justify-between items-center h-[56px] sm:h-[64px] lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 h-full py-2">
              <Image
                src="/whalert.svg"
                alt="لوگو"
                width={145}
                height={145}
                className="w-24 h-24 sm:w-28 sm:h-28 lg:w-[145px] lg:h-[145px] object-contain"
              />
            </Link>

            {/* Desktop nav + CTA (lg and up) */}
            <div className="hidden lg:flex flex-1 items-center justify-between gap-6">
              <div className="flex items-center gap-6 xl:gap-9">
                {navLinks.map((link) => {
                  const isActive =
                    (link.href === "/" && (activeSection === "home" || activeSection === "")) ||
                    (link.href.startsWith("/#") && activeSection === link.href.split("#")[1]);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(event) =>
                        handleSmoothNavigate(event, link.href)
                      }
                      className={cn(
                        "relative transition-all font-medium py-7",
                        isActive
                          ? "text-font-medium font-bold"
                          : "text-font-white hover:text-font-light",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              {isLoggedIn ? (
                <Button
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                  variant="default"
                  size="md"
                  icon={
                    <LayoutDashboard className="text-primary-300" size={20} />
                  }
                >
                  <span className="text-white">پنل کاربری</span>
                </Button>
              ) : (
                <div className="h-[42px] rounded-full bg-primary-450/40 px-2 py-1 flex items-center gap-1.5">
                  <span className="text-primary-300 pr-1">
                    <UserIcon className="text-primary-300" />
                  </span>
                  <Link href="/auth/sign-in" className="text-white">
                    ورود
                  </Link>
                  <span className="text-white/40">|</span>
                  <Link href="/auth/sign-up" className="text-white">
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile: menu button */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="باز کردن منو"
                className="p-2.5 rounded-full text-font-white hover:bg-primary-500/50 hover:text-primary-100 transition-colors"
              >
                <MenuIcon size={26} />
              </button>
            </div>
          </nav>
        </div>
      </header>
      <div aria-hidden className="h-[74px] sm:h-[86px] lg:h-[98px]" />

      <LandingSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
