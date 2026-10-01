export type * from "./cnn";
export type * from "./kompas";
export type * from "./tribunNews";


export type NewsArticle = {
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
};
