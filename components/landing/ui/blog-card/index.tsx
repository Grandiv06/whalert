import { ArrowUpLeftIcon } from "@/components/icons/landing-icons";
import { Blog } from "@/lib/landing-api/blogs";
import Image from "next/image";
import Link from "next/link";

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="rounded-4xl flex flex-col items-start gap-3 bg-[#542c85a5]"
    >
      {blog.imageAddress && (
        <div className="w-full h-40 rounded-t-3xl overflow-hidden relative before:content-[''] before:absolute before:inset-0 before:bg-primary-400/30 before:opacity-50 before:z-10">
          <Image
            src={blog.imageAddress}
            alt={blog.title || "blog image"}
            width={500}
            height={500}
            className="object-cover w-full opacity-70 h-full rounded-t-3xl drop-shadow-lg grayscale"
          />
        </div>
      )}
      <div className="p-6 flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2.5">
          <h3 className="font-semibold">{blog.title}</h3>
          <p className="line-clamp-1">{blog.description}</p>
        </div>
        <div className="w-10 h-10 shrink-0 rounded-full bg-primary-300 flex items-center justify-center">
          <ArrowUpLeftIcon className="text-white" size={20} />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
