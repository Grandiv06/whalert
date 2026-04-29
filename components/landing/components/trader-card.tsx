import Image from "next/image";

const TraderCard = ({ name }: { name: string }) => {
  return (
    <div className="w-fit flex flex-col items-center flex-wrap justify-center gap-3">
      <div className="h-20 lg:w-20 lg:h-20 rounded-3xl overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:bg-primary-400/30 before:opacity-50 before:z-10 bg-primary-450/20">
        <div className="w-full h-full bg-primary-400/30" />
      </div>
      <p className="text-xs border-b border-white pb-1.5 text-white">{name}</p>
    </div>
  );
};

export default TraderCard;
