export type CNNNewsData = {
  title: string;
  image_thumbnail: string;
  image_full: string;
  time: string;
  link: string;
  slug: string;
  content: string;
};

export type CNNNewsResponse = {
  status: boolean;
  data: CNNNewsData[];
  timestamp?: string;
};
