export interface Tool {
  id: number;
  title: string | null;
  description: string | null;
  imageAddress: string | null;
}

export const toolsApi = {
  getAll: async (): Promise<Tool[]> => {
    return [];
  },

  create: async (tool: Omit<Tool, "id">): Promise<Tool> => {
    return { id: Date.now(), ...tool };
  },
};
