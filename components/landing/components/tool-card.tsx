import Image from "next/image";

const ToolCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => {
  return (
    <div
      className="relative p-6 rounded-3xl flex flex-col gap-3 min-h-[180px] overflow-hidden"
      style={{
        backgroundColor: "#2B2349",
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Icon - top right (img for SVG, Image for raster) */}
      <div className="absolute top-5 right-5 w-[60px] h-[60px] flex items-center justify-center shrink-0">
        {image.endsWith(".svg") ? (
          // eslint-disable-next-line @next/next/no-img-element -- SVG must use img for correct rendering
          <img
            src={image}
            alt={title}
            width={60}
            height={60}
            className="object-contain w-[60px] h-[60px]"
          />
        ) : (
          <Image
            src={image}
            alt={title}
            width={60}
            height={60}
            className="object-contain w-[60px] h-[60px]"
            style={{ imageRendering: "pixelated" }}
            unoptimized
          />
        )}
      </div>

      {/* Text - right-aligned (RTL) */}
      <div className="flex flex-col gap-2 text-right mt-14">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/90 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ToolCard;
