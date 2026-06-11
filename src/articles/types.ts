export type ArticleVideoData = {
  title: string;
  scriptSummary: string;
  durationInFrames: number;
  style: string;
  effects?: VideoBriefItem[];
  manualAssets?: VideoBriefItem[];
};

export type VideoBriefItem = {
  mode: string;
  id: string;
  type: string;
  anchor: string;
  name: string;
  text: string;
  motion: string;
  duration: string;
  sound: string;
  outputName: string;
  requiredAction: string;
  capcutAction: string;
};

export type ArticleProject = {
  id: string;
  title: string;
  slug: string;
  video: ArticleVideoData;
};
