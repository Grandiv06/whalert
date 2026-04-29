import { defaultBlogs } from "@/config/landing-config";

export interface Blog {
  id: number;
  title: string | null;
  description: string | null;
  imageAddress: string | null;
}

export const blogsApi = {
  getAll: async (): Promise<Blog[]> => {
    return defaultBlogs as Blog[];
  },

  create: async (blog: Omit<Blog, "id">): Promise<Blog> => {
    return { id: Date.now(), ...blog };
  },
};
