export interface TribunNewsData {
  title: string;
  link: string;
  image_thumbnail: string;
  time: string;
  channel: string;
}

export interface TribunNewsResponse {
  status: boolean;
  data: TribunNewsData[];
  timestamp?: string;
}
