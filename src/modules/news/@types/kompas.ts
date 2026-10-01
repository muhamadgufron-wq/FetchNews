export type KompasNewsData = {
  title: string;
  link: string;
  image: string;
  category: string;
  date: string;
};

export type KompasNewsResponse = {
  status: boolean;
  data: KompasNewsData[];
  timestamp?: string;
};
