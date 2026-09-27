"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  ExternalLink,
  Clock,
  Share2,
  Check,
  TrendingUp,
  X,
  Radio,
  User,
  ArrowUpRight,
} from "lucide-react";
import { NewsArticle } from "@/modules/news/@types";
import { NewsService } from "@/modules/news/newsService";
import { cn } from "@/lib/utils";

export interface CardNewsProps {
  article?: NewsArticle;
  id?: string;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  imageUrl?: string;
  source?: {
    id?: string;
    name: string;
    badgeColor?: string;
  };
  category?: string;
  publishedAt?: string;
  author?: string;
  readTimeMinutes?: number;
  url?: string;
  isTrending?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  featured?: boolean;
  className?: string;
}

export function CardNews(props: CardNewsProps) {
  // Dukungan data dari NewsArticle atau props kustom
  const item = {
    id: props.article?.id || props.id || "news-card",
    title: props.article?.title || props.title || "Judul Berita",
    description:
      props.description ||
      (props.article?.content
        ? props.article.content.replace(/^Daftar Isi\s+[a-zA-Z\s,]+--\s*/i, "").slice(0, 160) +
          "..."
        : props.article?.title || "Deskripsi ringkas berita."),
    content:
      props.article?.content || (typeof props.content === "string" ? props.content : undefined),
    url: props.article?.link || props.url || "#",
    imageUrl: props.article?.image || props.imageUrl,
    source: props.article?.source ||
      props.source || {
        id: "media",
        name: "Media Terpercaya",
        badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      },
    category: props.article?.category || props.category || "Berita",
    publishedAt: props.article?.date || props.publishedAt || "",
    author: props.author || props.article?.source?.name || "Redaksi",
    readTimeMinutes: props.readTimeMinutes || 3,
    isTrending: props.isTrending ?? false,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isBookmarked = props.isBookmarked ?? false;
  const layoutId = `card-news-${item.id}-${item.title.slice(0, 20)}`;

  // Cegah scroll pada body ketika modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Dukungan tombol Escape untuk menutup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.clipboard && item.url) {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onToggleBookmark) {
      props.onToggleBookmark(item.id);
    }
  };

  return (
    <>
      {/* Kartu Grid / Collapsed View */}
      <motion.div
        layoutId={layoutId}
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer",
          props.featured ? "md:col-span-2 lg:flex-row lg:items-stretch" : "",
          props.className,
        )}
      >
        {/* Gambar Pratinjau */}
        <motion.div
          layoutId={`image-container-${layoutId}`}
          className={cn(
            "relative overflow-hidden bg-muted/60 shrink-0",
            props.featured
              ? "h-64 sm:h-72 lg:h-auto lg:w-1/2 min-h-[260px]"
              : "h-48 sm:h-52 w-full",
          )}
        >
          {item.imageUrl && !imageError ? (
            <motion.img
              layoutId={`image-${layoutId}`}
              src={item.imageUrl}
              alt={item.title}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-muted/80 to-muted text-muted-foreground text-xs font-medium">
              Pratinjau Gambar Berita
            </div>
          )}

          {/* Badge Sumber & Trending */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-xs",
                item.source.badgeColor || "bg-background/90 text-foreground border-border",
              )}
            >
              {item.source.name}
            </span>
            {item.isTrending && (
              <span className="flex items-center gap-1 rounded-lg bg-amber-500/90 text-white px-2 py-1 text-[11px] font-bold backdrop-blur-md shadow-xs">
                <TrendingUp className="h-3 w-3" />
                Trending
              </span>
            )}
          </div>

          {/* Tombol Cepat Simpan */}
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={isBookmarked ? "Hapus dari simpanan" : "Simpan artikel"}
            className={cn(
              "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md transition-all active:scale-90",
              isBookmarked
                ? "border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "border-border/60 bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground",
            )}
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
          </button>
        </motion.div>

        {/* Konten Teks Kartu */}
        <div
          className={cn(
            "flex flex-1 flex-col justify-between p-5 sm:p-6",
            props.featured ? "lg:w-1/2" : "",
          )}
        >
          <div className="space-y-3">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase font-semibold tracking-wider text-primary text-[11px]">
                {item.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {NewsService.formatRelativeTime(item.publishedAt)}
              </span>
              {item.readTimeMinutes && (
                <>
                  <span>•</span>
                  <span>{item.readTimeMinutes} mnt baca</span>
                </>
              )}
            </div>

            {/* Judul */}
            <motion.h3
              layoutId={`title-${layoutId}`}
              className={cn(
                "font-bold tracking-tight text-foreground transition-colors group-hover:text-primary",
                props.featured
                  ? "text-xl sm:text-2xl line-clamp-2"
                  : "text-base sm:text-lg line-clamp-2",
              )}
            >
              {item.title}
            </motion.h3>

            {/* Cuplikan */}
            <motion.p
              layoutId={`desc-${layoutId}`}
              className={cn(
                "text-sm text-muted-foreground leading-relaxed",
                props.featured ? "line-clamp-3 sm:line-clamp-4" : "line-clamp-2",
              )}
            >
              {item.description}
            </motion.p>
          </div>

          {/* Footer Kartu */}
          <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
            <span className="text-muted-foreground font-medium truncate max-w-[140px] sm:max-w-[200px]">
              Oleh {item.author || item.source.name}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                title="Salin tautan artikel"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-[11px] text-emerald-500 font-medium">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px]">Bagikan</span>
                  </>
                )}
              </button>

              <span className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary/10 text-primary px-3 text-[11px] font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <span>Detail</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal View / Expandable Detail View */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              layoutId={layoutId}
              className="relative w-full max-w-3xl max-h-[90vh] bg-card rounded-2xl overflow-hidden border border-border z-10 flex flex-col shadow-2xl"
            >
              {/* Tombol Tutup */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup pratinjau"
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center bg-background/70 hover:bg-accent rounded-full border border-border text-foreground transition-colors backdrop-blur-md cursor-pointer shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Gambar Header Modal */}
              <motion.div
                layoutId={`image-container-${layoutId}`}
                className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-muted/40"
              >
                {item.imageUrl && !imageError ? (
                  <motion.img
                    layoutId={`image-${layoutId}`}
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    Pratinjau Berita
                  </div>
                )}

                {/* Badge Sumber & Kategori di atas Gambar Modal */}
                <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2 z-10">
                  <span
                    className={cn(
                      "rounded-lg border px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-md",
                      item.source.badgeColor || "bg-background/90 text-foreground border-border",
                    )}
                  >
                    {item.source.name}
                  </span>
                  <span className="rounded-lg bg-black/60 text-white px-3 py-1 text-xs font-medium backdrop-blur-md uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </motion.div>

              {/* Area Isi Detail Berita */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {/* Meta Detail: Penulis, Tanggal, Waktu Baca */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b border-border/60 pb-4">
                  {item.author && (
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {item.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {NewsService.formatRelativeTime(item.publishedAt)}
                  </span>
                  {item.readTimeMinutes && <span>• {item.readTimeMinutes} menit baca</span>}
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Radio className="h-3 w-3" />
                    Sumber Terverifikasi
                  </span>
                </div>

                {/* Judul Utama */}
                <motion.h2
                  layoutId={`title-${layoutId}`}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug"
                >
                  {item.title}
                </motion.h2>

                {/* Deskripsi / Cuplikan Lead */}
                <motion.p
                  layoutId={`desc-${layoutId}`}
                  className="text-base sm:text-lg text-foreground/90 font-medium leading-relaxed"
                >
                  {item.description}
                </motion.p>

                {/* Konten Lengkap / Tambahan */}
                <motion.div
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  transition={{ type: "spring", duration: 0.35, delay: 0.1 }}
                  className="text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4 pt-2"
                >
                  {props.content ? (
                    props.content
                  ) : (
                    <>
                      <p>
                        Artikel ini dihimpun secara otomatis oleh sistem agregator FetchNews dari
                        kanal publik resmi <strong>{item.source.name}</strong>. Untuk membaca ulasan
                        lengkap, liputan lapangan, foto-foto dokumentasi, serta hak cipta penuh dari
                        penerbit, silakan kunjungi portal asli sumber melalui tombol di bawah.
                      </p>
                      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs sm:text-sm text-muted-foreground flex items-center justify-between">
                        <span>
                          Penerbit: <strong>{item.source.name}</strong>
                        </span>
                        <span>
                          ID Dokumen: <code className="text-primary">{item.id}</code>
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Action Bar Modal */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Tombol Bookmark */}
                    <button
                      type="button"
                      onClick={handleBookmarkClick}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer",
                        isBookmarked
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                      <span>{isBookmarked ? "Tersimpan" : "Simpan Bacaan"}</span>
                    </button>

                    {/* Tombol Bagikan */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex h-10 items-center gap-2 px-4 rounded-xl border border-border bg-background text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Tautan Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-4 w-4" />
                          <span>Bagikan</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tombol Baca ke Sumber Asli */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <span>Baca di {item.source.name}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CardNews;
