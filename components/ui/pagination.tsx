"use client";

import { Button } from "@/components/ui/button";
import useDevice from "@/hooks/useDevice";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const device = useDevice();
  const pages: (number | "ellipsis")[] = [];
  const maxVisible = 5;
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 w-full",
        device === "mobile" ? "flex-col justify-center" : "",
        className,
      )}
    >
      {/* موبایل: همه در یک ستون وسط‌چین */}
      {device === "mobile" ? (
        <>
          <div className="flex items-center gap-1">
            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <span
                  key={`e-${i}`}
                  className="px-2 text-[#6b7280] dark:text-white/60"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0 rounded-full min-w-9",
                    currentPage === p
                      ? "bg-[#2ab4a4] dark:bg-[#2b154d] text-white dark:text-[#a975e9] hover:bg-[#2ab4a4] dark:hover:bg-[#2b154d]"
                      : "bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)]",
                  )}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              ),
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-9 px-4 rounded-full border-[#e5e7eb] dark:border-white/20 bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)]"
            >
              قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-9 px-4 rounded-full border-[#e5e7eb] dark:border-white/20 bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)]"
            >
              بعدی
            </Button>
          </div>
        </>
      ) : (
        /* دسکتاپ: راست = بعدی + قبلی، وسط = شماره صفحات، چپ = از X مورد + نمایش (RTL) */
        <>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="h-9 px-4 rounded-full border-[#e5e7eb] dark:border-white/20 bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)] cursor-pointer"
            >
              بعدی
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="h-9 px-4 rounded-full border-[#e5e7eb] dark:border-white/20 bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)] cursor-pointer"
            >
              قبلی
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1 flex-shrink-0 px-4">
            {pages.map((p, i) =>
              p === "ellipsis" ? (
                <span
                  key={`e-${i}`}
                  className="px-2 text-[#6b7280] dark:text-white/60"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 w-9 p-0 rounded-full min-w-9 cursor-pointer",
                    currentPage === p
                      ? "bg-[#2ab4a4] dark:bg-[#2b154d] text-white dark:text-[#a975e9] hover:bg-[#2ab4a4] dark:hover:bg-[#2b154d]"
                      : "bg-transparent text-[#6b7280] dark:text-white/70 hover:bg-[rgba(128,128,128,0.2)]",
                  )}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              ),
            )}
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="text-sm text-muted-foreground">نمایش</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-9 w-[72px] px-3 gap-2 bg-transparent border-[#e5e7eb] dark:border-white/20 flex-row-reverse cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent
                position="popper"
                align="center"
                className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] bg-[#1A1A2E] border-white/10 rounded-xl shadow-xl py-1.5 backdrop-blur-md"
              >
                {pageSizeOptions.map((s) => (
                  <SelectItem
                    key={s}
                    value={s.toString()}
                    dir="rtl"
                    className="justify-center items-center text-center pl-10 pr-4 py-3 text-white rounded-lg data-[highlighted]:bg-white/10 data-[state=checked]:bg-purple-500/25 data-[state=checked]:text-purple-100 focus:bg-white/10 cursor-pointer text-center"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              از {totalItems.toLocaleString("fa-IR")} مورد
            </span>
          </div>
        </>
      )}
    </div>
  );
}
