import { TribunNewsData, TribunNewsResponse, NewsArticle } from "../@types";
import { onGet } from "@/services/apiServices";

const TRIBUN_API_URL = "https://api.siputzx.my.id/api/berita/tribunnews";

export class TribunNewsService {
  /**
   * Adapter untuk mengubah objek TribunNewsData menjadi format NewsArticle
   */
  static mapToNewsArticle(item: TribunNewsData): NewsArticle {
    return {
      id: item.link,
      title: item.title,
      link: item.link,
      image: item.image_thumbnail,
      category: item.channel,
      date: item.time,
      content: undefined,
      source: {
        id: "tribun",
        name: "Tribun News",
        badgeColor: "bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/20",
      },
    };
  }

  /**
   * Mengambil data berita dari API Tribun News dengan deduplikasi otomatis
   */
  static async getArticles(apiUrl: string = TRIBUN_API_URL): Promise<NewsArticle[]> {
    try {
      const response = await onGet<TribunNewsResponse>(apiUrl);
      const data = response.data || [];
      const mapped = data.map(TribunNewsService.mapToNewsArticle);

      // Buang artikel kembar/duplikat dari respons API
      const seen = new Set<string>();
      return mapped.filter((item) => {
        if (!item.id || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } catch (error) {
      console.error("Gagal mengambil berita Tribun News:", error);
      return [];
    }
  }
}
