"use client";

import { StarIcon } from "@/components/icons/landing-icons";
import Image from "next/image";
import { useState } from "react";

export interface CommentProfile {
  imageAddress?: string | null;
  fullName?: string | null;
  date?: string | null;
}

export interface Comment {
  id: number;
  rate: number | null;
  description: string | null;
  date?: string | null;
  profile: CommentProfile | null;
}

const StarRating = ({ rate }: { rate: number }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          filled={index < rate}
          size={20}
          className={index < rate ? "fill-[#EEC643] text-[#EEC643]" : "text-[#EEC643]"}
        />
      ))}
    </div>
  );
};

const CommentCard = ({
  comment,
  index,
}: {
  comment: Comment;
  index?: number;
}) => {
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
        isSecondCard ? "bg-primary-450" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {rate > 0 && <StarRating rate={rate} />}
        <span className="text-4xl text-white/50">&ldquo;</span>
      </div>
      {description && (
        <p className="border-b border-white/50 pb-4 text-white">{description}</p>
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
            <p className="text-white">{profile.fullName}</p>
            <p className="text-sm text-white/70">{date}</p>
          </div>
        </div>
      ) : (
        <div className="w-[50px] h-[50px] bg-gray-300 rounded-full" />
      )}
    </div>
  );
};

export default CommentCard;
