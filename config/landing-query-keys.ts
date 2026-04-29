export const queryKeys = {
  platforms: {
    all: ["platforms"] as const,
    lists: () => [...queryKeys.platforms.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.platforms.lists(), { filters }] as const,
    details: () => [...queryKeys.platforms.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.platforms.details(), id] as const,
  },

  tools: {
    all: ["tools"] as const,
    lists: () => [...queryKeys.tools.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.tools.lists(), { filters }] as const,
    details: () => [...queryKeys.tools.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.tools.details(), id] as const,
  },

  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
  },

  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    list: (filters?: { limit?: number }) =>
      [...queryKeys.comments.lists(), { filters }] as const,
    details: () => [...queryKeys.comments.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.comments.details(), id] as const,
  },

  blogs: {
    all: ["blogs"] as const,
    lists: () => [...queryKeys.blogs.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.blogs.lists(), { filters }] as const,
    details: () => [...queryKeys.blogs.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.blogs.details(), id] as const,
  },

  signals: {
    all: ["signals"] as const,
    lists: () => [...queryKeys.signals.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.signals.lists(), { filters }] as const,
  },

  stats: {
    all: ["stats"] as const,
    lists: () => [...queryKeys.stats.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.stats.lists(), { filters }] as const,
    details: () => [...queryKeys.stats.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.stats.details(), id] as const,
  },
} as const;
