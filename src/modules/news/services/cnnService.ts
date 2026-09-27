import { CNNNewsData, CNNNewsResponse, NewsArticle } from "../@types";
import { onGet } from "@/services/apiServices";

const CNN_API_URL = "https://api.siputzx.my.id/api/berita/cnn";

export class CNNService {
  /**
   * Adapter untuk mengubah objek CNNNewsData menjadi format NewsArticle
   */
  static mapToNewsArticle(item: CNNNewsData): NewsArticle {
    const categorySlug = item.slug ? item.slug.split("/").filter(Boolean)[0] : "Umum";
    const category = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    return {
      id: item.slug || item.link,
      title: item.title,
      link: item.link,
      image: item.image_full || item.image_thumbnail,
      category,
      date: item.time,
      content: item.content,
      source: {
        id: "cnn",
        name: "CNN Indonesia",
        badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      },
    };
  }

  /**
   * Mengambil data berita dari API CNN Indonesia
   */
  static async getArticles(apiUrl: string = CNN_API_URL): Promise<NewsArticle[]> {
    try {
      const response = await onGet<CNNNewsResponse>(apiUrl);
      const data = response.data || [];
      return data.map(CNNService.mapToNewsArticle);
    } catch (error) {
      console.error("Gagal mengambil berita CNN:", error);
      return [];
    }
  }
}
