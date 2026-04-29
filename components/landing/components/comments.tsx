"use client";
import CommentCard from "@/components/landing/ui/comment-card";
import CommentCardSkeleton from "@/components/landing/ui/comment-card/comment-card-skeleton";
import { queryKeys } from "@/config/landing-query-keys";
import { commentsApi } from "@/lib/landing-api/comments";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const Comments = () => {
  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.comments.list({ limit: 2 }),
    queryFn: () => commentsApi.getAll({ limit: 2 }),
  });

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6">
          {[1, 2, 3].map((i) => (
            <CommentCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-white/70">
          خطا در بارگذاری نظرات
        </div>
      ) : !comments || comments.length === 0 ? (
        <div className="text-center py-8 text-white/70">نظری یافت نشد</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          <div className="flex w-full flex-col gap-3">
            <div className="flex gap-2 flex-col">
              <div className="w-9 h-2.5 rounded-full bg-primary-400/80"></div>
              <div className="w-11 h-2.5 rounded-full bg-primary-400"></div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold">
              رضایت کاربران از والرت
            </h2>
            <p className="text-sm text-white/70">نظرات کاربران</p>
            <Image
              src="/images/star.svg"
              className="w-full max-w-xs h-36 sm:h-48"
              alt="comments"
              width={192}
              height={192}
            />
          </div>
          {comments.map((comment, index) => (
            <CommentCard key={comment.id} comment={comment} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
