"use client";

import BlogCard from "./blog-card";
import BlogCardSkeleton from "@/components/landing/ui/blog-card/blog-card-skeleton";
import SectionHeader from "./section-header";
import { defaultBlogs } from "@/config/landing-config";
import { queryKeys } from "@/config/landing-query-keys";
import { Blog, blogsApi } from "@/lib/landing-api/blogs";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const BlogSection = () => {
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.blogs.list(),
    queryFn: blogsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <SectionHeader title="وبلاگ و مقالات تخصصی" description="وبلاگ" />
        <div className="blog-swiper-wrapper">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper"
          >
            {[1, 2, 3].map((i) => (
              <SwiperSlide key={i}>
                <BlogCardSkeleton />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
        <SectionHeader title="وبلاگ و مقالات تخصصی" description="وبلاگ" />
        <div className="text-center py-8 text-white/70">خطا در دریافت بلاگ‌ها</div>
      </div>
    );
  }

  const list = blogs && blogs.length > 0 ? blogs : defaultBlogs;

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="وبلاگ و مقالات تخصصی" description="وبلاگ" />
      <div className="blog-swiper-wrapper">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={list.length > 1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="blog-swiper"
        >
          {list.map((blog: Blog) => (
            <SwiperSlide key={blog.id}>
              <BlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogSection;
