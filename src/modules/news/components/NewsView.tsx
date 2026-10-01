"use client";

import { useState } from "react";
import { NewsSourceId } from "../newsService";
import { useNewsQuery } from "../hooks/useNewsQuery";
import { CardNews } from "@/components/ui/CardNews";
import { Tabs } from "@/components/ui/Tabs";
import Loading from "@/components/ui/Loading";
import Image from "next/image";
import { Globe, AlertCircle, RefreshCw } from "lucide-react";

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
  const [selectedSource, setSelectedSource] = useState<NewsSourceId>("all");

  // TanStack Query: otomatis caching per source & instan saat pindah tab
  const {
    data: articles = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useNewsQuery(selectedSource);

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

  const activeTab = SOURCE_TABS.find((t) => t.id === selectedSource);

  return (
    <div className="space-y-6">
      {/* Header Feed & Tabs Sumber Media */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Berita Terbaru</h2>
          
          {/* Tombol manual refresh untuk memaksa perbarui data */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Perbarui berita dari sumber"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin text-primary" : ""}`} />
            <span>{isFetching ? "Menyinkronkan..." : "Perbarui"}</span>
          </button>
        </div>

        {/* Tab pengalih sumber berita (Fluid Tabs) */}
        <Tabs
          tabs={SOURCE_TABS}
          value={selectedSource}
          onChange={(id) => setSelectedSource(id as NewsSourceId)}
          size="sm"
        />
      </div>

      {/* Loading State saat mengambil data baru yang belum ada di cache */}
      {isLoading ? (
        <Loading text={`Memuat artikel dari ${activeTab?.label || "sumber berita"}...`} />
      ) : error ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-500/30 p-12 text-center bg-red-500/5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Gagal memuat berita</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Terjadi kendala saat menghubungi server penyedia berita. Silakan coba lagi.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      ) : articles.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card/40">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Belum ada artikel</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Artikel dari sumber yang dipilih belum tersedia saat ini.
          </p>
        </div>
      ) : (
        /* Grid Kartu Berita */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            return (
              <CardNews
                key={`${article.id}-${index}`}
                article={article}
                featured={index === 0}
                isBookmarked={bookmarkedIds.includes(article.id)}
                onToggleBookmark={toggleBookmark}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

