import { defaultUsers } from "@/config/landing-config";

export interface User {
  id: number;
  name: string | null;
  imageAddress: string | null;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    return defaultUsers as User[];
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    return { id: Date.now(), ...user };
  },
};
