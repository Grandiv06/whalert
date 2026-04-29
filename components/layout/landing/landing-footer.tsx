"use client";

import {
  AparatIcon,
  ArrowLeftIcon,
  CallCallingIcon,
  DirectboxNotifIcon,
  InstagramIcon,
  LinkdinIcon,
  LocationIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/components/icons/landing-icons";
import { ContentWrapper } from "@/components/layout/landing/content-wrapper";
import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-primary-450">
      <ContentWrapper>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-8 lg:gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center justify-center lg:justify-start">
                <Image src="/whalert.svg" alt="logo" width={120} height={120} />
              </div>
              <div className="rounded-full bg-primary-450/80 text-center lg:w-fit w-full px-2.5 py-3">
                <p className="text-sm font-semibold ">
                  پلتفرمی پیشرو برای ارائه سیگنال‌های معاملاتی
                </p>
              </div>
              <p className="text-xs text-white/80">
                لورم ایپسوم متــــــن ساخــتگی با تولـید سـادگی نامفهـوم از
                صنعـــت چاپ، و با استـــفاده از طراحان گـــــرافیک است، چاپگرها
                و متــون بلکه روزنامه و مجله در ستون و سطـرآنچنـان که لازم
                است...
              </p>
            </div>

            <div className="flex flex-row sm:flex-row items-start sm:items-center justify-items-start gap-8 sm:gap-10">
              <div>
                <p className="text-lg font-extrabold my-3">لینک های مفید</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">صفحه اصلی</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">سیگنال‌ها</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">تحلیل بازار</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">سیگنال‌های معاملاتی</Link>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-lg font-extrabold my-3">لینک‌های پشتیبانی</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">درباره ما</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">مسیر و سابقه</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">سوالات متداول</Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-primary-450/50"></div>
                    <Link href="/">قوانین</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-col gap-6 hidden lg:flex ">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <CallCallingIcon className="text-primary-450" />
                  <p className="text-sm text-white/50">
                    02100000000_0912000000000
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LocationIcon className="text-primary-450" />
                  <p className="text-sm text-white/50">
                    لورم ایپسوم متن ساختگی با تولـید سـادگی نامفهـــــوم ...
                  </p>
                </div>
              </div>

              <div className="bg-primary-450 rounded-2xl flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="opacity-50">
                    {" "}
                    <DirectboxNotifIcon />
                  </div>

                  <p className="text-lg text-white/50">خبرنامه</p>
                </div>
                <div className="bg-white/20 w-full rounded-lg px-2 h-12 flex items-center justify-between">
                  <input
                    className="w-full h-full rounded-lg p-2 border-none outline-none"
                    type="email"
                    placeholder="ایمیل خود را وارد کنید."
                  />
                  <div className="w-7 h-7 flex items-center justify-center bg-white/20 rounded-lg">
                    <ArrowLeftIcon className="text-white w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:hidden gap-3">
            <div className="flex items-start gap-2">
              <CallCallingIcon className="text-primary-450" />
              <p className="text-sm text-white/50">02100000000_0912000000000</p>
            </div>
            <div className="flex items-center gap-2">
              <LocationIcon className="text-primary-450" />
              <p className="text-sm text-white/50">
                لورم ایپسوم متن ساختگی با تولـید سـادگی نامفهـــــوم ...
              </p>
            </div>
          </div>

          <div className="min-h-16 w-full lg:bg-primary-450 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-4 p-4 sm:px-12 sm:py-4 relative">
            <button
              type="button"
              onClick={handleScrollToTop}
              className="w-15 h-15 hidden lg:flex relative cursor-pointer right-0 md:right-12 -top-10 bg-primary-450 items-center justify-center rounded-full bg-gray-450 outline-4 ouline-offset-4 outline-[#1a0c35]"
            >
              <ArrowLeftIcon className="text-white w-6 h-6 sm:w-8 rotate-90" />
            </button>
            <div className="">
              <p className="text-xs hidden lg:block sm:text-sm text-white px-2">
                تمامی حقوق مادی و معنوی این وبسایت متعلق به والرت می باشد و
                هرگونه کپی برداری پیگرد قانونی دارد.
              </p>
            </div>

            <div className="flex items-center gap-4 order-1 sm:order-2">
              <Link href="/">
                <AparatIcon />
              </Link>
              <Link href="/">
                <LinkdinIcon />
              </Link>
              <Link href="/">
                <InstagramIcon />
              </Link>
              <Link href="/">
                <TwitterIcon />
              </Link>
              <Link href="/">
                <TelegramIcon />
              </Link>
            </div>
          </div>

          <div className="flex-col gap-6 flex ">
            <div className="bg-primary-450 rounded-2xl flex md:hidden flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <div className="opacity-50">
                  {" "}
                  <DirectboxNotifIcon />
                </div>

                <p className="text-lg text-white/50">خبرنامه</p>
              </div>
              <div className="bg-white/20 w-full rounded-lg px-2 h-12 flex items-center justify-between">
                <input
                  className="w-full h-full rounded-lg p-2 border-none outline-none"
                  type="email"
                  placeholder="ایمیل خود را وارد کنید."
                />
                <div className="w-7 h-7 flex items-center justify-center bg-white rounded-lg">
                  <ArrowLeftIcon className="text-primary-400 m-1 w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
      <p className="text-xs block lg:hidden text-center mb-6 sm:text-sm text-white px-2">
        تمامی حقوق مادی و معنوی این وبسایت متعلق به والرت می باشد و هرگونه کپی
        برداری پیگرد قانونی دارد.
      </p>
    </footer>
  );
};

export { Footer as LandingFooter };
export default Footer;
