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
    <div className="p-6 rounded-3xl flex flex-col gap-2 bg-primary-150/20">
      <Image src={image} alt={title} width={60} height={60} />
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-sm text-font-light">{description}</p>
    </div>
  );
};

export default ToolCard;
