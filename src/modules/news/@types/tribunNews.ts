export type TribunNewsData = {
  title: string;
  link: string;
  image_thumbnail: string;
  time: string;
  channel: string;
};

export type TribunNewsResponse = {
  status: boolean;
  data: TribunNewsData[];
  timestamp?: string;
};
