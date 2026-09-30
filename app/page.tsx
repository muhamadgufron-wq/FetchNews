import Link from "next/link";
import { ArrowDown, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsView } from "@/modules/news";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]">
              Satu Pintu untuk Seluruh Berita dari{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Media Terpercaya
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              FetchNews menyatukan berita dan analisis mendalam dari berbagai kantor berita nasional
              dan internasional. Cari topik, bandingkan sudut pandang, dan simpan bacaan favorit
              Anda secara instan.
            </p>
          </div>
        </div>
      </section>

      {/* Main News Aggregator Application Feed */}
      <section id="feed" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <NewsView />
      </section>
    </main>
  );
}
