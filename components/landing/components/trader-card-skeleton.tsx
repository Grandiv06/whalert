import { Skeleton } from "@/components/ui/skeleton";

const TraderCardSkeleton = () => {
  return (
    <div className="w-fit flex flex-col items-center justify-center gap-3">
      <Skeleton className="w-20 h-20 rounded-3xl bg-primary-400/20" />
      <Skeleton className="h-4 w-24 rounded-sm bg-primary-400/20" />
    </div>
  );
};

export default TraderCardSkeleton;
