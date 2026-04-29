const defaultTraderImage = "/images/traders/1.jpg";
import Image from "next/image";

const TraderCard = ({
  name,
  imageAddress,
}: {
  name: string;
  imageAddress?: string | null;
}) => {
  const imageSrc = imageAddress || defaultTraderImage;
  return (
    <div className="w-fit flex flex-col items-center flex-wrap justify-center gap-3">
      <div className="h-20 lg:w-20 lg:h-20 rounded-3xl overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:bg-primary-400/30 before:opacity-50 before:z-10">
        <Image
          src={"/images/traders/1.jpg"}
          alt={name}
          width={96}
          height={96}
          className="object-cover w-full opacity-70 h-full rounded-3xl drop-shadow-lg grayscale"
        />
      </div>
      <p className="text-xs border-b border-white pb-1.5 ">{name}</p>
    </div>
  );
};

export default TraderCard;
