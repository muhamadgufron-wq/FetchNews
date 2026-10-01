import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik",
});

import { Navbar, Footer } from "@/components/layout";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "FetchNews - Portal Berita Multi-Sumber Terkini",
  description:
    "Agregator berita cerdas dan terkurasi secara real-time dari berbagai media nasional dan internasional terpercaya.",
  keywords: [
    "berita",
    "news aggregator",
    "portal berita",
    "teknologi",
    "bisnis",
    "politik",
    "multi-source",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`h-full antialiased ${rubik.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors selection:bg-blue-600 selection:text-white">
        <QueryProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

