"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./skeleton";

interface QuerySkeletonProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  render: (data: T) => React.ReactNode;
  skeleton?: React.ReactNode;
  error?: (error: Error) => React.ReactNode;
}

/**
 * A wrapper component that automatically shows a skeleton loader
 * while React Query is fetching data
 */
export function QuerySkeleton<T>({
  queryKey,
  queryFn,
  render,
  skeleton,
  error,
}: QuerySkeletonProps<T>) {
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    queryKey,
    queryFn,
  });

  if (isLoading) {
    return skeleton || <Skeleton className="h-32 w-full" />;
  }

  if (isError && error) {
    return error(queryError as Error);
  }

  if (isError) {
    return (
      <div className="text-red-500">
        خطا در بارگذاری داده‌ها: {(queryError as Error)?.message}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <>{render(data)}</>;
}







