"use client";

import { StarIcon } from "@/components/icons/landing-icons";
import { Comment } from "@/lib/landing-api/comments";
import Image from "next/image";
import { useState } from "react";

interface CommentCardProps {
  comment: Comment;
  index?: number;
}

const StarRating = ({ rate }: { rate: number }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          filled={index < rate}
          className={index < rate ? "fill-amber-400 text-amber-400" : "text-amber-400"}
        />
      ))}
    </div>
  );
};

const CommentCard = ({ comment, index }: CommentCardProps) => {
  const rate = comment.rate || 0;
  const description = comment.description || "";
  const profile = comment.profile;
  const date = comment.date || "";
  const [imageError, setImageError] = useState(false);

  if (!profile) {
    return null;
  }

  const imageSrc = profile.imageAddress || "";
  const isSecondCard = index === 0;

  return (
    <div
      className={`rounded-4xl border border-primary-450 px-10 py-6 flex flex-col gap-4 ${
        isSecondCard ? "bg-primary-450" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {rate > 0 && <StarRating rate={rate} />}
        <Image src="/images/double.svg" alt="quote" width={50} height={50} />
      </div>
      {description && (
        <p className="border-b border-white/50 pb-4">{description}</p>
      )}

      {imageSrc && !imageError ? (
        <div className="flex items-center gap-2 ">
          <Image
            className="rounded-full"
            src={imageSrc}
            alt={profile.fullName || "User"}
            width={57}
            height={57}
            onError={() => setImageError(true)}
            unoptimized
          />

          <div>
            <p>{profile.fullName}</p>
            <p className="text-sm">{date}</p>
          </div>
        </div>
      ) : (
        <div className="w-[50px] h-[50px] bg-gray-300 rounded-full" />
      )}
    </div>
  );
};

export default CommentCard;
