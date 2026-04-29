import { defaultPlatforms } from "@/config/landing-config";

export interface Platform {
  id: number;
  title: string | null;
  description: string | null;
  imageAddress: string | null;
}

export const platformsApi = {
  getAll: async (): Promise<Platform[]> => {
    return defaultPlatforms as Platform[];
  },

  getById: async (id: number): Promise<Platform> => {
    const found = (defaultPlatforms as Platform[]).find((p) => p.id === id);
    if (!found) throw new Error(`Platform ${id} not found`);
    return found;
  },

  create: async (platform: Omit<Platform, "id">): Promise<Platform> => {
    return { id: Date.now(), ...platform };
  },

  update: async (
    id: number,
    platform: Partial<Platform>
  ): Promise<Platform> => {
    const found = (defaultPlatforms as Platform[]).find((p) => p.id === id);
    if (!found) throw new Error(`Platform ${id} not found`);
    return { ...found, ...platform };
  },

  delete: async (_id: number): Promise<void> => {
    // no-op in static mode
  },
};
