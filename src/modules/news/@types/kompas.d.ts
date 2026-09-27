export interface KompasNewsData {
  title: string;
  link: string;
  image: string;
  category: string;
  date: string;
}

export interface KompasNewsResponse {
  status: boolean;
  data: KompasNewsData[];
  timestamp?: string;
}
