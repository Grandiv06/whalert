import type { LucideIcon } from "lucide-react";
import Image from "next/image";

const PlatformsCard = ({
  title,
  description,
  imageAddress,
  icon: Icon,
}: {
  title: string;
  description: string;
  imageAddress: string;
  icon?: LucideIcon;
}) => {
  return (
    <div className="w-full min-h-[72px] rounded-3xl relative -top-2 bg-white flex justify-between items-center px-6 sm:px-8 py-4">
      <div className="rounded-full shrink-0 bg-primary-450/20 p-2 flex items-center justify-center w-[68px] h-[68px]">
        {imageAddress ? (
          <Image
            className="w-10 h-10 object-contain"
            src={imageAddress}
            alt={title}
            width={68}
            height={68}
          />
        ) : Icon ? (
          <Icon className="w-10 h-10 text-primary-450 shrink-0" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-450/30" />
        )}
      </div>
      <div className="w-full min-w-0 flex-1">
        <h3 className="text-primary-450 text-center text-lg font-semibold">
          {title}
        </h3>
        <p className="text-font-dark text-center text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default PlatformsCard;
