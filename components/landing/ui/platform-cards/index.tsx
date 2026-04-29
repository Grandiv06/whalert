import Image from "next/image";

const PlatformsCard = ({
  title,
  description,
  imageAddress,
}: {
  title: string;
  description: string;
  imageAddress: string;
}) => {
  return (
    <div className="w-full rounded-3xl relative -top-2 bg-white flex justify-between items-center px-8 py-4 ">
      <div className="rounded-full shrink-0 bg-primary-450/20 p-2 flex items-center justify-center">
        <Image
          className="w-10"
          src={imageAddress}
          alt={title}
          width={68}
          height={68}
        />
      </div>
      <div className="w-full">
        <h3 className="text-primary-450 text-center text-lg font-semibold">
          {title}
        </h3>
        <p className="text-font-dark text-center">{description}</p>
      </div>
    </div>
  );
};

export default PlatformsCard;
