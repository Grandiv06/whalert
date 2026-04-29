"use client";

import { ArrowIcon } from "@/components/icons/landing-icons";
import { Button } from "@/components/landing/ui/button/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LandingLogin = () => {
  const router = useRouter();
  return (
    <div id="home" className="flex flex-col gap-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center font-extrabold flex flex-wrap justify-center gap-x-2 gap-y-1 mx-auto px-1 text-white">
        والرت اولین پلتفرم هوشمند سیگنال معاملاتی{" "}
        <span className="text-primary-300">به ویژه انس طلا</span>
      </h1>
      <p className="text-center text-sm sm:text-base md:text-lg text-[#9B96A6] font-medium max-w-2xl mx-auto px-2">
        ترکیبی از تحلیل انسانی و قدرت هوش مصنوعی؛ برای ارائه دقیق‌ترین
        سیگنال‌های معاملاتی
      </p>
      <div
        className="w-full max-w-sm sm:max-w-none sm:w-fit mx-auto my-6 sm:my-8 md:my-11 flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center px-2"
        dir="rtl"
      >
        <Button
          size="lg"
          variant="default"
          reverse
          className="text-white"
          icon={<ArrowIcon className="w-8 h-8 p-2 text-white rounded-full bg-primary-450" />}
          onClick={() => router.push("/dashboard/create-signal")}
        >
          دریافت اولین سیگنال
        </Button>
        <Button
          size="lg"
          variant="white"
          icon={
            <Image
              src="/icons/signal-icon.svg"
              alt=""
              width={28}
              height={28}
              className="shrink-0"
            />
          }
          onClick={() => router.push("/auth/sign-up")}
        >
          مشاهده سیگنال ها
        </Button>
      </div>
    </div>
  );
};

export default LandingLogin;
