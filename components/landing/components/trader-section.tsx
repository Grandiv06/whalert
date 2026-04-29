"use client";

import TitleDesc from "@/components/landing/ui/title-desc";
import TraderCard from "@/components/landing/ui/trander-card";
import { defaultUsers } from "@/config/landing-config";

const TraderSection = () => {
  const users = defaultUsers;

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      <div className="w-full">
        <TitleDesc
          btnTitle={"بررسی استیتمنت‌ها"}
          title={"نگاهی به تخصص و استیتمنت تریدرهای والرت"}
          description={`
            در این بخش، استیتمنت‌ها و چارچوب فکری پلتفرم به‌صورت شفاف ارائه شده‌اند .این موارد نشان می‌دهند تصمیم‌گیری‌ها بر چه اصولی انجام می‌شود و منطق تحلیل‌ها چیست. ما به‌جای وعده‌های غیرواقعی، فرآیند، دیدگاه و نحوه مواجهه با بازار را مشخص می‌کنیم. کاربران با بررسی این استیتمنت‌ها می‌توانند درک دقیقی از رویکرد پلتفرم داشته باشند. شفافیت در اصول، اولین قدم برای اعتماد بلندمدت است.
          `}
        />
      </div>

      <div className="relative w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(16,8,38,0.5),rgba(25,12,54,1))] lg:bg-[linear-gradient(to_right,rgba(0,0,0,0),rgba(16,8,38,0.5),rgba(25,12,54,1))] z-10"></div>

        <div className="grid flex-1 grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-5">
          {users.map((user) => (
            <TraderCard
              key={user.id}
              name={user.name || ""}
              imageAddress={user.imageAddress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraderSection;
