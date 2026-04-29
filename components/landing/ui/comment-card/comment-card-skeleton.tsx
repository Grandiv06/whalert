import { Skeleton } from "@/components/ui/skeleton";

const CommentCardSkeleton = () => {
  return (
    <div className="w-full rounded-4xl border border-primary-450 px-10 py-6 flex flex-col gap-4 min-h-[240px]">
      {/* Top row: stars + quote icon — same as CommentCard (StarIcon + Image 50x50) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-5 h-5 rounded-full shrink-0"
            />
          ))}
        </div>
        <Skeleton className="w-[50px] h-[50px] rounded-lg shrink-0" />
      </div>

      {/* Description block — same as CommentCard (border-b border-white/50 pb-4) */}
      <div className="border-b flex border-white/50 pb-4 space-y-2 min-h-[72px]">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Avatar + name + date — same as CommentCard (57x57 avatar) */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-[57px] h-[57px] rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>
    </div>
  );
};

export default CommentCardSkeleton;
