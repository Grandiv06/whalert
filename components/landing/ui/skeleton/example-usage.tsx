"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { QuerySkeleton } from "./query-skeleton";
import { Skeleton } from "./skeleton";

// Example 1: Using Skeleton directly with React Query
export function ExampleWithDirectSkeleton() {
  const { data, isLoading } = useQuery({
    queryKey: ["example-data"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { title: "عنوان نمونه", description: "توضیحات نمونه" };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  return (
    <div>
      <h2>{data?.title}</h2>
      <p>{data?.description}</p>
    </div>
  );
}

// Example 2: Using QuerySkeleton wrapper component
export function ExampleWithQuerySkeleton() {
  return (
    <QuerySkeleton
      queryKey={["user-data"]}
      queryFn={async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          name: "کاربر نمونه",
          email: "user@example.com",
          avatar: "https://via.placeholder.com/100",
        };
      }}
      skeleton={
        <div className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      }
      render={(data) => (
        <div className="flex gap-4">
          <Image
            src={data.avatar}
            alt={data.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full"
          />
          <div>
            <h3>{data.name}</h3>
            <p>{data.email}</p>
          </div>
        </div>
      )}
    />
  );
}

// Example 3: Card skeleton pattern
export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

// Example 4: List skeleton pattern
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-16 w-16 rounded" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}







