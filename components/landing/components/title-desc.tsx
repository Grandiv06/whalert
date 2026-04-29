"use client";

import { ArrowIcon } from "@/components/icons/landing-icons";
import { Button } from "@/components/landing/ui/button/button";
import { useRouter } from "next/navigation";

const TitleDesc = ({
  title,
  titleDesc,
  description,
  btnTitle,
}: {
  title: string;
  titleDesc?: string;
  description: string;
  btnTitle: string;
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-2 flex-col">
        <div className="w-9 h-2.5 rounded-full bg-primary-400/80"></div>
        <div className="w-11 h-2.5 rounded-full bg-primary-400"></div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      {titleDesc && (
        <div className="rounded-2xl bg-primary-400 w-fit px-3 sm:px-4 py-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {titleDesc}
          </h3>
        </div>
      )}
      <p className="text-xs sm:text-sm text-white/80 leading-6.5">
        {description}
      </p>

      <Button
        size="lg"
        variant="default"
        reverse
        className="text-white"
        icon={<ArrowIcon className="w-5 h-5 text-primary-450" />}
        onClick={() => router.push("/auth/sign-up")}
      >
        {btnTitle}
      </Button>
    </div>
  );
};

export default TitleDesc;
