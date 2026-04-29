import { Skeleton } from "@/components/ui/skeleton";

const BlogCardSkeleton = () => {
  return (
    <div className="rounded-4xl flex flex-col items-start gap-3 bg-[#542c85a5]">
      {/* Image skeleton */}
      <div className="w-full h-40 rounded-t-3xl overflow-hidden">
        <Skeleton className="w-full h-full rounded-t-3xl bg-primary-400/20" />
      </div>

      {/* Content section */}
      <div className="p-6 flex justify-between items-center gap-4 w-full">
        <div className="flex flex-col gap-2.5 flex-1">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 bg-primary-400/20" />
          {/* Description skeleton */}
          <Skeleton className="h-4 w-full bg-primary-400/20" />
        </div>
        {/* Arrow icon button skeleton */}
        <Skeleton className="w-10 h-10 shrink-0 rounded-full bg-primary-400/20" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;






