import type { CoverData, CoverVariant } from "../cover";

export type ArticleVideoData = {
  title: string;
  scriptSummary: string;
  durationInFrames: number;
  style: string;
};

export type ArticleProject = {
  id: string;
  title: string;
  slug: string;
  cover: {
    data: CoverData;
    variants: CoverVariant[];
  };
  video: ArticleVideoData;
};
