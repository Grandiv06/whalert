"use client";

import Image from "next/image";
import TitleDesc from "./title-desc";

const WhySignal = () => {
  return (
    <div id="services" className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
      <div className="w-full lg:max-w-[55%] order-2 lg:order-1">
        <TitleDesc
          btnTitle="ورود/ثبت‌نام"
          title="چرا بیشتر سیگنال‌ها به ضرر ختم می‌شن؟"
          titleDesc="مشکل بازار سیگنال، خود سیگنال نیست؛ روش ارائه و مدیریتشه."
          description={`بیشتر سیگنال‌هایی که در بازار منتشر می‌شن، صرفاً یک عدد یا نقطه ورود هستن؛ بدون اینکه سناریوی مشخصی برای مدیریت معامله، حد ضرر یا خروج ارائه بدن.
این نوع سیگنال‌ها نه سابقه قابل بررسی دارن، نه شفافیتی در عملکرد گذشته، و نه مسئولیتی در قبال نتیجه معامله.
ما در این پلتفرم، انتشار سیگنال رو صرفاً ارسال یک عدد نمی‌دونیم. هر سیگنال با سناریوی کامل ورود و خروج، مدیریت ریسک و ثبت در آرشیو منتشر می‌شه تا کاربر بتونه تصمیم آگاهانه بگیره و عملکرد گذشته رو بررسی کنه.`}
        />
      </div>
      <div className="w-full lg:max-w-[45%] mt-12 lg:mt-0 order-1 lg:order-2 flex justify-center">
        <Image
          className="w-full max-w-md lg:max-w-none mx-auto rounded-2xl object-cover"
          src="/images/btcImage.png"
          alt="چرا سیگنال - دارایی و سیگنال"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default WhySignal;
