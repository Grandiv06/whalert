const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col gap-3 text-center">
      <div className="flex gap-2 flex-col mx-auto items-center">
        <div className="w-9 h-2.5 rounded-full bg-primary-400/80"></div>
        <div className="w-11 h-2.5 rounded-full bg-primary-400"></div>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mx-auto px-1">{title}</h2>
      <p className="text-xs sm:text-sm text-white/50 leading-6.5 mx-auto max-w-xl">
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
