import { defaultStats } from "@/config/landing-config";

export interface Stat {
  id: number;
  title: string | null;
  desc: string | null;
}

export const statsApi = {
  getAll: async (): Promise<Stat[]> => {
    return defaultStats as Stat[];
  },

  create: async (stat: Omit<Stat, "id">): Promise<Stat> => {
    return { id: Date.now(), ...stat };
  },
};
