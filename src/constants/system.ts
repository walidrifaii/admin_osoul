/** Same-origin proxy — see admin/next.config.ts rewrites (/api → backend). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
