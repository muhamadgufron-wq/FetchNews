import { KompasNewsData, KompasNewsResponse, NewsArticle } from "../@types";
import { onGet } from "@/services/apiServices";

const KOMPAS_API_URL = "https://api.siputzx.my.id/api/berita/kompas";

export class KompasService {
  /**
   * Adapter untuk mengubah objek KompasNewsData menjadi format NewsArticle
   */
  static mapToNewsArticle(item: KompasNewsData): NewsArticle {
    return {
      id: item.link,
      title: item.title,
      link: item.link,
      image: item.image,
      category: item.category || "Kompas",
      date: item.date,
      content: undefined, // Kompas API menyediakan ringkasan via link
      source: {
        id: "kompas",
        name: "Kompas",
        badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      },
    };
  }

  /**
   * Mengambil data berita dari API Kompas
   */
  static async getArticles(apiUrl: string = KOMPAS_API_URL): Promise<NewsArticle[]> {
    try {
      const response = await onGet<KompasNewsResponse>(apiUrl);
      const data = response.data || [];
      return data.map(KompasService.mapToNewsArticle);
    } catch (error) {
      console.error("Gagal mengambil berita Kompas:", error);
      return [];
    }
  }
}
