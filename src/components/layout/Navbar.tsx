"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, Search, Menu, X, Radio, Flame } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  savedCount?: number;
  activeSourcesCount?: number;
  onOpenSearch?: () => void;
}

export function Navbar({ savedCount = 0, activeSourcesCount = 4, onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors">
      {/* Top micro-bar for Live Status */}
      <div className="hidden sm:flex items-center justify-between border-b border-border/40 px-4 sm:px-8 py-1 text-xs text-muted-foreground bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Live Aggregator
          </span>
          <span className="text-border">|</span>
          <span>{activeSourcesCount} Media Terkoneksi (CNN, BBC, Antara, CNBC)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            Topik Hangat: Kecerdasan Buatan & Ekonomi Digital
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold text-lg tracking-tight transition-transform active:scale-95"
          >
            <div className="flex flex-col">
              <span className="leading-none text-foreground font-bold">
                Fetch<span className="text-blue-600 dark:text-blue-400">News</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-normal tracking-wide">
                MULTI-SOURCE PORTAL
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-foreground hover:bg-muted/60 transition-colors"
            >
              Semua Berita
            </Link>
            <Link
              href="/#kategori"
              className="rounded-lg px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Kategori
            </Link>
            <Link
              href="/#sumber"
              className="rounded-lg px-3 py-1.5 hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5"
            >
              <Radio className="h-3.5 w-3.5 text-blue-500" />
              Sumber Media
            </Link>
          </nav>
        </div>

        {/* Center / Search Trigger Button */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex w-full items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3.5 py-1.5 text-sm text-muted-foreground hover:border-border hover:bg-muted/70 transition-all shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Cari berita, topik, atau kata kunci...</span>
            </span>
            <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Cari berita"
            className="inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka menu navigasi"
            className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-1 font-medium text-sm">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-foreground bg-muted/60"
            >
              Semua Berita
            </Link>
            <Link
              href="/#kategori"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/40"
            >
              Kategori Berita
            </Link>
            <Link
              href="/#sumber"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/40 flex items-center justify-between"
            >
              <span>Sumber Media</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                {activeSourcesCount} Aktif
              </span>
            </Link>
            <Link
              href="/#tersimpan"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/40 flex items-center justify-between"
            >
              <span>Artikel Tersimpan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {savedCount}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
