import { defaultComments } from "@/config/landing-config";

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

export const commentsApi = {
  getAll: async (params?: { limit?: number }): Promise<Comment[]> => {
    const data = defaultComments as Comment[];
    if (params?.limit != null) return data.slice(0, params.limit);
    return data;
  },

  getById: async (id: number): Promise<Comment> => {
    const found = (defaultComments as Comment[]).find((c) => c.id === id);
    if (!found) throw new Error(`Comment ${id} not found`);
    return found;
  },

  create: async (comment: Omit<Comment, "id">): Promise<Comment> => {
    return { id: Date.now(), ...comment };
  },
};
