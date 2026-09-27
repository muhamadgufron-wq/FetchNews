export * from "./cnn.d";
export * from "./kompas.d";
export * from "./tribunNews.d";

export interface NewsArticle {
  id: string;
  title: string;
  link: string;
  image?: string;
  category?: string;
  date?: string;
  content?: string;
  source: {
    id: "cnn" | "kompas" | string;
    name: string;
    badgeColor: string;
  };
}
