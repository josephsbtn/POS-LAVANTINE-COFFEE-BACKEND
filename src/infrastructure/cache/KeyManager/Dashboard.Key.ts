export const DashboardCacheKeys = {
  dynamic: (prefix: string, query: any) => `dashboard:${prefix}:${JSON.stringify(query)}`,
  PATTERN_ALL: "dashboard:*",
};
