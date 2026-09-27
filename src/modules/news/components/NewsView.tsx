"use client";

import { useEffect, useState } from "react";
import { NewsArticle } from "../@types";
import { NewsService, NewsSourceId } from "../newsService";
import { CardNews } from "@/components/ui/CardNews";
import { Tabs } from "@/components/ui/Tabs";
import Image from "next/image";
import { Globe, Newspaper, AlertCircle, RefreshCw } from "lucide-react";

const SOURCE_TABS = [
  {
    id: "all",
    label: "Semua Berita",
    icon: <Globe className="h-4 w-4 text-primary" />,
  },
  {
    id: "cnn",
    label: "CNN Indonesia",
    icon: (
      <Image
        src="/logo/cnn-indonesia-seeklogo.svg"
        alt="CNN Indonesia"
        width={16}
        height={16}
        className="h-4 w-4 object-contain"
      />
    ),
  },
  {
    id: "kompas",
    label: "Kompas",
    icon: (
      <Image
        src="/logo/Logo_Kompasdotcom-removebg-preview.webp"
        alt="Kompas"
        width={16}
        height={16}
        className="h-4 w-4 object-contain"
      />
    ),
  },
  {
    id: "tribun",
    label: "Tribun News",
    icon: (
      <Image
        src="https://www.google.com/s2/favicons?domain=tribunnews.com&sz=64"
        alt="Tribun News"
        width={16}
        height={16}
        unoptimized
        className="h-4 w-4 rounded-full object-contain"
      />
    ),
  },
];

export function NewsView() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<NewsSourceId>("all");

  // Inisialisasi bookmarks dari localStorage dengan lazy initializer
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("fetchnews_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (articleId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(articleId);
      const next = exists ? prev.filter((id) => id !== articleId) : [...prev, articleId];
      try {
        localStorage.setItem("fetchnews_bookmarks", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Muat artikel dari API NewsService berdasarkan tab sumber yang dipilih
  useEffect(() => {
    let isCancelled = false;

    NewsService.getArticles(selectedSource).then((data) => {
      if (!isCancelled) {
        setArticles(data);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedSource]);

  return (
    <div className="space-y-6">
      {/* Header Feed & Tabs Sumber Media */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground tracking-tight">Tajuk Berita Terkini</h2>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse ml-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" />
              Memuat...
            </span>
          )}
        </div>

        {/* Tab pengalih sumber berita (Fluid Tabs) */}
        <Tabs
          tabs={SOURCE_TABS}
          value={selectedSource}
          onChange={(id) => setSelectedSource(id as NewsSourceId)}
          size="sm"
        />
      </div>

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Belum ada artikel</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Artikel dari sumber yang dipilih belum tersedia saat ini.
          </p>
        </div>
      )}

      {/* Grid Kartu Berita */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => {
          return (
            <CardNews
              key={`${article.id}-${index}`}
              article={article}
              featured={index === 0} // Artikel pertama sebagai hero/featured card
              isBookmarked={bookmarkedIds.includes(article.id)}
              onToggleBookmark={toggleBookmark}
            />
          );
        })}
      </div>
    </div>
  );
}
