"use client";

import { useQuery } from "@tanstack/react-query";
import { NewsService, NewsSourceId } from "../newsService";
import { NewsArticle } from "../@types";

export const NEWS_QUERY_KEY = "news-articles";

/**
 * Custom hook untuk mengambil dan meng-cache berita menggunakan TanStack Query v5.
 * Data di-cache per-sumber berita (`source`) sehingga perpindahan tab terjadi secara instan tanpa fetch berulang.
 */
export function useNewsQuery(source: NewsSourceId) {
  return useQuery<NewsArticle[]>({
    queryKey: [NEWS_QUERY_KEY, source],
    queryFn: () => NewsService.getArticles(source),
    staleTime: 1000 * 60 * 5, // 5 menit data segar
  });
}
