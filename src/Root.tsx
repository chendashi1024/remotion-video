import "./index.css";
import { Composition } from "remotion";
import { studioArticleProjects } from "./articles";
import { CoverStill, coverVariants, getCompositionId } from "./cover";
import { ArticleDebugVideo } from "./video/article-debug/ArticleDebugVideo";
import { RemotionIntro } from "./video/remotion-intro";
import { ChapterTimeline, fallbackTimeline } from "./video/timeline";
import { defaultVfxEffect, VfxClip } from "./video/vfx";
import { MatrixBrandLayer, MatrixOpcPreview, MatrixPersistentOverlay } from "./video/matrix-opc";

export const RemotionRoot: React.FC = () => {
  const defaultArticle = studioArticleProjects[0];

  return (
    <>
      {defaultArticle ? (
        <>
          <Composition
            id="article-video"
            component={ArticleDebugVideo}
            durationInFrames={defaultArticle.video.durationInFrames}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{
              data: defaultArticle.video,
            }}
          />
          {coverVariants.map((variant) => (
            <Composition
              key={getCompositionId(defaultArticle.cover.data, variant)}
              id={getCompositionId(defaultArticle.cover.data, variant)}
              component={CoverStill}
              durationInFrames={1}
              fps={30}
              width={1080}
              height={1440}
              defaultProps={{
                data: defaultArticle.cover.data,
                variant,
              }}
            />
          ))}
        </>
      ) : null}
      <Composition
        id="remotion-intro"
        component={RemotionIntro}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="vfx-clip"
        component={VfxClip}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          effect: defaultVfxEffect,
          durationInFrames: 90,
        }}
      />
      <Composition
        id="chapter-timeline"
        component={ChapterTimeline}
        durationInFrames={18000}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          timeline: fallbackTimeline,
        }}
      />
      <Composition
        id="matrix-opc-style-preview"
        component={MatrixOpcPreview}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="matrix-brand-layer"
        component={MatrixBrandLayer}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="matrix-persistent-overlay"
        component={MatrixPersistentOverlay}
        durationInFrames={18000}
        fps={30}
        width={1920}
        height={1080}
      />
      {studioArticleProjects.map((article) => (
        <Composition
          key={`article-${article.slug}-video`}
          id={`article-${article.slug}-video`}
          component={ArticleDebugVideo}
          durationInFrames={article.video.durationInFrames}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            data: article.video,
          }}
        />
      ))}
      {studioArticleProjects.map((article) =>
        article.cover.variants.map((variant) => (
          <Composition
            key={`article-${article.slug}-cover-${variant}`}
            id={`article-${article.slug}-cover-${variant}`}
            component={CoverStill}
            durationInFrames={1}
            fps={30}
            width={1080}
            height={1440}
            defaultProps={{
              data: article.cover.data,
              variant,
            }}
          />
        ))
      )}
    </>
  );
};
