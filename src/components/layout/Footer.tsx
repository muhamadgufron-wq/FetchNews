import Link from "next/link";
import { Rss, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-muted/20 text-muted-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight"
            >
              <span>
                Fetch<span className="text-blue-600 dark:text-blue-400">News</span>
              </span>
            </Link>
            <p className="text-sm max-w-md text-muted-foreground leading-relaxed">
              Platform agregator berita modern yang mengumpulkan, menyeleksi, dan menyajikan artikel
              terkini dari berbagai media terpercaya secara real-time dalam satu antarmuka yang
              bersih dan cepat.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Kategori Populer
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#kategori" className="hover:text-foreground transition-colors">
                  Teknologi & AI
                </Link>
              </li>
              <li>
                <Link href="/#kategori" className="hover:text-foreground transition-colors">
                  Bisnis & Finansial
                </Link>
              </li>
              <li>
                <Link href="/#kategori" className="hover:text-foreground transition-colors">
                  Nasional & Politik
                </Link>
              </li>
              <li>
                <Link href="/#kategori" className="hover:text-foreground transition-colors">
                  Sains & Lingkungan
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Media Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Sumber Media Terhubung
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5 text-blue-500" />
                <span>Antara News</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5 text-red-500" />
                <span>CNN Indonesia</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5 text-sky-500" />
                <span>CNBC Indonesia</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5 text-indigo-500" />
                <span>Global Feeds (BBC / Reuters)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider & disclaimer */}
        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} FetchNews. Hak cipta artikel milik masing-masing penerbit
            media.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Multi-Source Verification
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">Dibangun dengan Next.js & Bun</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
