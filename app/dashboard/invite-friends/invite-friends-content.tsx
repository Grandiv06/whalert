"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  QuestionCircleIcon,
  PhoneCallIcon,
} from "@/components/icons/dashboard-icons";
import useDevice from "@/hooks/useDevice";
import { useQuery } from "@tanstack/react-query";
import {
  UserDashboardService,
  type PagedResultDtoOfReferralTransactionOutPutDto,
  type ReferralTransactionOutPutDto,
  RewardType,
} from "@/lib/api/client";

type AbpWrapper<T> = { result?: T };

function getRewardTypeLabel(type?: RewardType) {
  switch (type) {
    case RewardType._1:
      return "پاداش رفرال";
    case RewardType._2:
      return "پاداش حجم معاملات";
    default:
      return "نامشخص";
  }
}

function MobileSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="w-full bg-[#02000B]/30 border-white/5"
          dir="rtl"
        >
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <Skeleton className="h-4 w-24 bg-white/10" />
              <Skeleton className="h-4 w-20 bg-white/10" />
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-4 w-24 bg-white/10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DesktopSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow
          key={i}
          className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
        >
          {[1, 2, 3, 4].map((j) => (
            <TableCell key={j} className="text-center h-[72px] px-6 py-8">
              <Skeleton className="h-4 w-24 mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function InviteFriendsContent() {
  const device = useDevice();
  const isMobile = device === "mobile";
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const inviteLink = "https://panel.signals.studio/my-profile/";
  const inviteCode = "۶۳۴.۱۳۷";
  const currentDate = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const invitedCount = "۲۸ نفر";

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["referralTransactions"],
    queryFn: async () => {
      const res =
        await UserDashboardService.apiServicesAppUserdashboardReferraltransactionsPost(
          {
            maxResultCount: 10,
            skipCount: 0,
            sorting: "referalTime desc",
          },
        );
      const wrapped =
        res as unknown as AbpWrapper<PagedResultDtoOfReferralTransactionOutPutDto>;
      return wrapped?.result ?? res;
    },
  });

  const referralTransactions =
    transactionsData?.items?.map(
      (item: ReferralTransactionOutPutDto, index: number) => ({
        id: index,
        symbol: item.symbol || "-",
        amount: item.rewardAmount
          ? `${item.rewardAmount.toLocaleString("fa-IR")} تومان`
          : "۰ تومان",
        type: getRewardTypeLabel(item.rewardType),
        date: item.referalTime
          ? new Date(item.referalTime).toLocaleDateString("fa-IR")
          : "-",
      }),
    ) ?? [];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handleViewList = () => {
    console.log("View invited friends list");
  };

  return (
    <div className="mt-5" dir="rtl">
      {/* Date Header */}
      <div className="flex items-center justify-between gap-3 mb-5 md:mb-6">
        <div className="flex items-center gap-2 text-white/90">
          <CalendarIcon className=" text-white" />
          <span className="text-sm md:text-base whitespace-nowrap">{currentDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="تماس با پشتیبانی"
            >
              <PhoneCallIcon className="text-white" />
            </button>
            <button
              type="button"
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="سوالات متداول"
            >
              <QuestionCircleIcon className=" text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {isMobile ? (
          <div className="grid grid-cols-2 gap-3.5 w-full">
            <Card
              className="w-full min-h-[160px] flex flex-col bg-[#02000B]/60 border-white/5 rounded-[24px]"
              dir="rtl"
            >
              <CardContent className="p-4 flex flex-col items-center justify-between flex-1">
                <h3 className="text-[11px] font-medium text-white/70 mb-2">
                  کد دعوت شما
                </h3>
                <p className="text-[24px] font-bold text-white text-center mb-3 tracking-tight leading-none">
                  {inviteCode}
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full h-10 px-2 rounded-xl border border-[#6F3FB2] text-white text-[12px] font-medium hover:bg-[#542C85]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Image
                    src="/icons/copy-alt.svg"
                    alt="کپی"
                    width={20}
                    height={20}
                    className="w-5 h-5 shrink-0"
                  />
                  {copiedCode ? "کپی شد!" : "کپی کردن"}
                </button>
              </CardContent>
            </Card>
            <Card
              className="w-full min-h-[160px] flex flex-col bg-[#02000B]/60 border-white/5 rounded-[24px]"
              dir="rtl"
            >
              <CardContent className="p-4 flex flex-col items-center justify-between flex-1">
                <h3 className="text-[11px] font-medium text-white/70 mb-2">
                  لینک دعوت شما
                </h3>
                <p
                  className="text-[10px] text-white/90 break-all leading-tight text-center mb-3"
                  dir="ltr"
                >
                  {inviteLink}
                </p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full h-10 px-2 rounded-xl border border-[#6F3FB2] text-white text-[12px] font-medium hover:bg-[#542C85]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Image
                    src="/icons/copy-alt.svg"
                    alt="کپی"
                    width={20}
                    height={20}
                    className="w-5 h-5 shrink-0"
                  />
                  {copiedLink ? "کپی شد!" : "کپی کردن"}
                </button>
              </CardContent>
            </Card>
            <Card
              className="col-span-2 w-full bg-[#02000B]/60 border-white/5 rounded-[24px]"
              dir="rtl"
            >
              <CardContent className="p-6 flex items-center justify-between gap-3">
                <div className="text-right">
                  <h3 className="text-[14px] font-medium text-white/70">
                    کد دعوت شما
                  </h3>
                  <p className="text-[32px] font-bold text-white mt-1 leading-none">
                    {invitedCount}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleViewList}
                  className="h-10 px-6 rounded-xl border border-[#6F3FB2] text-white text-[12px] font-medium hover:bg-[#542C85]/20 transition-colors cursor-pointer whitespace-nowrap"
                >
                  مشاهده لیست
                </button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="h-[185px] flex flex-col bg-[#02000B]/30 rounded-[20px] p-6 border border-white/5">
              <h3 className="text-sm font-medium text-white/80 mb-2 text-center">
                کد دعوت شما
              </h3>
              <p className="text-2xl font-bold text-white mb-4 text-center flex-1">
                {inviteCode}
              </p>
              <button
                type="button"
                onClick={handleCopyCode}
                className="mt-auto w-full py-3 px-4 rounded-xl border-2 border-[#542C85] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image
                  src="/icons/copy-alt.svg"
                  alt="کپی"
                  width={20}
                  height={20}
                  className="w-5 h-5 shrink-0"
                />
                {copiedCode ? "کپی شد!" : "کپی کردن"}
              </button>
            </div>
            <div className="h-[185px] flex flex-col bg-[#02000B]/30 rounded-[20px] p-6 border border-white/5">
              <h3 className="text-sm font-medium text-white/80 mb-2 text-center">
                لینک دعوت شما
              </h3>
              <p
                className="text-sm text-white/90 truncate mb-4 text-center flex-1"
                dir="ltr"
              >
                {inviteLink}
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-auto w-full py-3 px-4 rounded-xl border-2 border-[#542C85] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Image
                  src="/icons/copy-alt.svg"
                  alt="کپی"
                  width={20}
                  height={20}
                  className="w-5 h-5 shrink-0"
                />
                {copiedLink ? "کپی شد!" : "کپی کردن"}
              </button>
            </div>
            <div className="h-[185px] flex flex-col bg-[#02000B]/30 rounded-[20px] p-6 border border-white/5">
              <h3 className="text-sm font-medium text-white/80 mb-2 text-center">
                تعداد دوستان دعوت شده
              </h3>
              <p className="text-2xl font-bold text-white mb-4 text-center flex-1">
                {invitedCount}
              </p>
              <button
                type="button"
                onClick={handleViewList}
                className="mt-auto w-full py-3 px-4 rounded-xl border-2 border-[#542C85] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                مشاهده لیست
              </button>
            </div>
          </>
        )}
      </div>

      {/* Referral Transactions Table */}
      <div className="overflow-hidden">
        <h2 className="text-xl font-bold text-white mb-4">تراکنش های رفرال</h2>
        {isMobile ? (
          <div className="space-y-4">
            {isLoading && <MobileSkeleton />}
            {!isLoading && referralTransactions.length === 0 && (
              <div className="text-center text-muted-foreground dark:text-white/70 py-8">
                هیچ تراکنشی یافت نشد.
              </div>
            )}
            {!isLoading &&
              referralTransactions.map((tx) => (
                <Card
                  key={tx.id}
                  className="w-full bg-[#02000B]/30 border-white/5"
                  dir="rtl"
                >
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-xs md:text-sm font-medium text-white">
                        نوع : {tx.type}
                      </p>
                      <p className="text-xs md:text-sm font-medium text-white flex-shrink-0">
                        تاریخ : {tx.date}
                      </p>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between items-center">
                      <p className="text-xs md:text-sm font-medium text-white">
                        نماد : {tx.symbol}
                      </p>
                      <p className="text-xs md:text-sm font-medium text-white">
                        مقدار : {tx.amount}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="overflow-x-auto px-4 md:px-0 [&_[data-slot=table-container]]:border-0 [&_[data-slot=table-container]]:rounded-[20px]">
              <Table className="min-w-[600px] md:min-w-0">
                <TableHeader className="h-14">
                  <TableRow>
                    <TableHead className="text-center text-white h-12">
                      نماد
                    </TableHead>
                    <TableHead className="text-center text-white h-12">
                      مقدار
                    </TableHead>
                    <TableHead className="text-center text-white h-12">
                      نوع
                    </TableHead>
                    <TableHead className="text-center text-white h-12">
                      تاریخ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && <DesktopSkeleton />}
                  {!isLoading && referralTransactions.length === 0 && (
                    <TableRow className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50">
                      <TableCell
                        className="text-center text-muted-foreground dark:text-white/70 h-[72px] px-6 py-8"
                        colSpan={4}
                      >
                        هیچ تراکنشی یافت نشد.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    referralTransactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="dark:bg-transparent bg-white dark:hover:bg-white/5 hover:bg-gray-50"
                      >
                        <TableCell className="text-center h-[72px] px-6 py-8">
                          {tx.symbol}
                        </TableCell>
                        <TableCell className="text-center h-[72px] px-6 py-8">
                          {tx.amount}
                        </TableCell>
                        <TableCell className="text-center h-[72px] px-6 py-8">
                          {tx.type}
                        </TableCell>
                        <TableCell className="text-center h-[72px] px-6 py-8">
                          {tx.date}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
