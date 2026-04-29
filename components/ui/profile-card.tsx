"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Check, BarChart3, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

export interface ProfileCardProps {
  name: string;
  rating: number;
  avatarSrc?: string | null;
  totalPositions: number;
  activePositions: number;
  lostPositions: number;
  successRate: number;
  failureRate: number;
  isFollowed?: boolean;
  onViewDetails?: () => void;
  onFollow?: () => void | Promise<void>;
  onUnfollow?: () => void | Promise<void>;
  onSettings?: () => void;
  className?: string;
}

export function ProfileCard({
  name,
  rating,
  avatarSrc,
  totalPositions,
  activePositions,
  lostPositions,
  successRate,
  failureRate,
  isFollowed = false,
  onViewDetails,
  onFollow,
  onUnfollow,
  onSettings,
  className,
}: ProfileCardProps) {
  const [openUnfollowDialog, setOpenUnfollowDialog] = useState(false);
  const [isFollowPending, setIsFollowPending] = useState(false);
  const [isUnfollowPending, setIsUnfollowPending] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarSrc]);

  const handleFollowClick = async () => {
    if (!onFollow || isFollowPending || isUnfollowPending) return;
    try {
      setIsFollowPending(true);
      await onFollow();
    } finally {
      setIsFollowPending(false);
    }
  };

  const handleUnfollow = async () => {
    if (!onUnfollow || isFollowPending || isUnfollowPending) return;
    if (onUnfollow) {
      try {
        setIsUnfollowPending(true);
        await onUnfollow();
        setOpenUnfollowDialog(false);
      } finally {
        setIsUnfollowPending(false);
      }
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-[#542C85]/20 border-0 rounded-2xl transition-all duration-300",
        className,
      )}
      dir="rtl"
    >
      {onSettings && (
        <button
          type="button"
          onClick={onSettings}
          className="absolute top-4 left-4 z-30 transition-all duration-200 hover:scale-110 cursor-pointer text-white"
          aria-label="تنظیمات"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path
              d="M22.5422 15.7997C21.5358 15.2154 20.9189 14.144 20.9189 12.9861C20.9189 11.8282 21.5358 10.7568 22.5422 10.1724C22.7154 10.0642 22.7803 9.84778 22.6721 9.67463L20.8649 6.55797C20.7999 6.43893 20.6809 6.37402 20.5618 6.37402C20.4969 6.37402 20.432 6.39565 20.3779 6.42811C19.8801 6.70948 19.3173 6.86098 18.7546 6.86098C18.181 6.86098 17.6183 6.70947 17.1097 6.41728C16.1033 5.83291 15.4864 4.77238 15.4864 3.61446C15.4864 3.40884 15.3241 3.24652 15.1293 3.24652H10.8439C10.6491 3.24652 10.4868 3.40884 10.4868 3.61446C10.4868 4.77238 9.86997 5.83291 8.86355 6.41728C8.35493 6.70947 7.79221 6.86098 7.21866 6.86098C6.65593 6.86098 6.0932 6.70948 5.5954 6.42811C5.42225 6.3199 5.20581 6.38482 5.10841 6.55797L3.29037 9.67463C3.2579 9.72874 3.24707 9.79368 3.24707 9.84778C3.24707 9.97765 3.31202 10.0967 3.43105 10.1724C4.43748 10.7568 5.05431 11.8173 5.05431 12.9752C5.05431 14.144 4.43745 15.2154 3.44185 15.7997H3.43105C3.25791 15.908 3.19295 16.1244 3.30117 16.2975L5.10841 19.4142C5.17334 19.5332 5.29238 19.5981 5.41142 19.5981C5.47635 19.5981 5.54129 19.5765 5.5954 19.544C6.61264 18.9705 7.85713 18.9705 8.86355 19.5549C9.85915 20.1393 10.476 21.1998 10.476 22.3577C10.476 22.5633 10.6383 22.7256 10.8439 22.7256H15.1293C15.3241 22.7256 15.4864 22.5633 15.4864 22.3577C15.4864 21.1998 16.1033 20.1393 17.1097 19.5549C17.6183 19.2627 18.181 19.1112 18.7546 19.1112C19.3173 19.1112 19.8801 19.2627 20.3779 19.544C20.551 19.6523 20.7675 19.5873 20.8649 19.4142L22.6829 16.2975C22.7154 16.2434 22.7262 16.1785 22.7262 16.1244C22.7262 15.9945 22.6612 15.8755 22.5422 15.7997ZM12.9866 16.2326C11.1902 16.2326 9.74011 14.7825 9.74011 12.9861C9.74011 11.1897 11.1902 9.73956 12.9866 9.73956C14.783 9.73956 16.2332 11.1897 16.2332 12.9861C16.2332 14.7825 14.783 16.2326 12.9866 16.2326Z"
              fill="currentColor"
            />
          </svg>
        </button>
      )}
      <div className="px-6 pt-8 pb-6 flex flex-col items-center space-y-4 relative z-10">
        <div className="relative flex items-center justify-center">
          <div className="flex items-center justify-center overflow-hidden">
            {avatarSrc && !avatarFailed ? (
              <img
                src={avatarSrc}
                alt={name}
                className="h-[70px] w-[70px] rounded-2xl object-cover"
                loading="lazy"
                onError={() => setAvatarFailed(true)}
              />
            ) : (
              <Image src="/user-tag.svg" alt="پروفایل" width={70} height={70} />
            )}
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-white leading-tight">{name}</h3>
          <div className="flex flex-row-reverse items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill={i < Math.floor(rating) ? "#542C85" : "none"}
                stroke={i < Math.floor(rating) ? "#542C85" : "#542C85"}
                strokeWidth={1.5}
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="flex flex-row-reverse items-center gap-2 w-full justify-center pt-2">
          <button
            onClick={onViewDetails}
            className="flex-1 max-w-full px-4 py-2.5 rounded-lg bg-[#542C85] text-white text-sm font-medium hover:opacity-90 transition-opacity text-center cursor-pointer"
          >
            مشاهده جزئیات
          </button>
          {isFollowed
            ? onUnfollow && (
                <AlertDialog
                  open={openUnfollowDialog}
                  onOpenChange={setOpenUnfollowDialog}
                >
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={isUnfollowPending || isFollowPending}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4C1767] text-white transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      aria-label="لغو دنبال کردن"
                    >
                      {isUnfollowPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>لغو دنبال کردن</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا مطمئن هستید که می‌خواهید {name} را دیگر دنبال نکنید؟
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={handleUnfollow}
                        disabled={isUnfollowPending}
                        className="bg-[#542C85] hover:bg-[#6B3A9E] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isUnfollowPending ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            در حال پردازش...
                          </span>
                        ) : (
                          "بله، لغو دنبال کردن"
                        )}
                      </AlertDialogAction>
                      <AlertDialogCancel
                        className="cursor-pointer"
                        disabled={isUnfollowPending}
                      >
                        انصراف
                      </AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )
            : onFollow && (
                <button
                  onClick={handleFollowClick}
                  disabled={isFollowPending || isUnfollowPending}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#542C85] text-white transition-all duration-200 hover:opacity-90 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  aria-label="دنبال کردن"
                >
                  {isFollowPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Image
                      src="/user-plus-bottom.svg"
                      alt="دنبال کردن"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  )}
                </button>
              )}
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="space-y-3">
          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 transition-colors duration-200">
            <span className="text-base font-bold text-white">
              {totalPositions.toLocaleString("fa-IR")}
            </span>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">
                تعداد موقعیتها
              </span>
            </div>
          </div>
          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 transition-colors duration-200">
            <span className="text-base font-bold text-white">
              {activePositions.toLocaleString("fa-IR")}
            </span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">
                موقعیت های فعال
              </span>
            </div>
          </div>
          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 transition-colors duration-200">
            <span className="text-base font-bold text-white">
              {lostPositions.toLocaleString("fa-IR")}
            </span>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-white">
                موقعیتهای از دست رفته
              </span>
            </div>
          </div>
          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 transition-colors duration-200 mt-6">
            <span className="text-base font-bold text-white">
              {successRate.toFixed(3)}%
            </span>
            <span className="text-sm font-medium text-white">نرخ موفقیت</span>
          </div>
          <div className="flex flex-row-reverse items-center justify-between p-3 rounded-lg bg-[#02000B]/30 transition-colors duration-200">
            <span className="text-base font-bold text-white">
              {failureRate.toFixed(3)}%
            </span>
            <span className="text-sm font-medium text-white">نرخ شکست</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
