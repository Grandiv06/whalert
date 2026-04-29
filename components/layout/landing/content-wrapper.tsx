export function ContentWrapper({
  children,
  hiddenPaddingY,
}: {
  children: React.ReactNode;
  hiddenPaddingY?: boolean;
}) {
  return (
    <div
      className={`max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 sm:py-8 md:py-10 ${
        hiddenPaddingY ? "py-0" : ""
      }`}
    >
      {children}
    </div>
  );
}
