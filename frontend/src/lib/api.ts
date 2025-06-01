export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
