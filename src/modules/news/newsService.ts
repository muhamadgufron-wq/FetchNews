import { NewsArticle } from "./@types";
import { CNNService } from "./services/cnnService";
import { KompasService } from "./services/kompasService";
import { TribunNewsService } from "./services/tribunNewsService";

export type NewsSourceId = "all" | "cnn" | "kompas" | "tribun";

export class NewsService {
  /**
   * Mengambil daftar artikel berita berdasarkan sumber pilihan
   */
  static async getArticles(source: NewsSourceId = "all"): Promise<NewsArticle[]> {
    try {
      if (source === "cnn") {
        return await CNNService.getArticles();
      }

      if (source === "kompas") {
        return await KompasService.getArticles();
      }

      if (source === "tribun") {
        return await TribunNewsService.getArticles();
      }

      // Jika "all": ambil secara paralel dari seluruh sumber berita
      const [cnnArticles, kompasArticles, tribunArticles] = await Promise.all([
        CNNService.getArticles(),
        KompasService.getArticles(),
        TribunNewsService.getArticles(),
      ]);

      // Gabungkan secara selang-seling (interleave) dan buang duplikasi artikel
      const merged: NewsArticle[] = [];
      const seen = new Set<string>();
      const maxLength = Math.max(
        cnnArticles.length,
        kompasArticles.length,
        tribunArticles.length
      );

      for (let i = 0; i < maxLength; i++) {
        const pool = [cnnArticles[i], kompasArticles[i], tribunArticles[i]];
        for (const article of pool) {
          if (article && article.id && !seen.has(article.id)) {
            seen.add(article.id);
            merged.push(article);
          }
        }
      }

      return merged;
    } catch (error) {
      console.error("Gagal mengagregasi berita:", error);
      return [];
    }
  }

  /**
   * Helper format waktu relatif (misal: "25 menit yang lalu")
   */
  static formatRelativeTime(dateString?: string): string {
    if (!dateString) return "Baru saja";

    // Jika format ISO atau YYYY-MM-DD HH:mm
    const date = new Date(dateString.replace(" ", "T"));
    if (!isNaN(date.getTime())) {
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSeconds < 60 && diffSeconds >= 0) return "Baru saja";
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60 && diffMinutes > 0) return `${diffMinutes} menit lalu`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24 && diffHours > 0) return `${diffHours} jam lalu`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7 && diffDays > 0) return `${diffDays} hari lalu`;
    }

    // Fallback jika berupa string tanggal biasa (misal "27 September 2026")
    return dateString;
  }
}
