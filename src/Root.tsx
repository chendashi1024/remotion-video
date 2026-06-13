import "./index.css";
import { Composition } from "remotion";
import { studioArticleProjects } from "./articles";
import { ArticleDebugVideo } from "./video/article-debug/ArticleDebugVideo";
import { RemotionIntro } from "./video/remotion-intro";
import { ChapterTimeline, fallbackTimeline } from "./video/timeline";
import { defaultVfxEffect, VfxClip, VfxDemo, VfxRealDemo } from "./video/vfx";
import type { VfxBriefItem } from "./video/vfx";
import { MatrixBrandLayer, MatrixOpcPreview, MatrixPersistentOverlay } from "./video/matrix-opc";
import { OpcComponentsShowcase, opcShowcaseDuration } from "./video/opc-components-showcase";
import demoEffects from "./video/vfx/demo-effects.json";

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
      <Composition
        id="opc-components-showcase"
        component={OpcComponentsShowcase}
        durationInFrames={opcShowcaseDuration}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="vfx-demo"
        component={VfxDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          effects: demoEffects.effects as VfxBriefItem[],
        }}
      />
      <Composition
        id="vfx-real-demo"
        component={VfxRealDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          effects: demoEffects.effects as VfxBriefItem[],
          backgroundImage: "person.png",
        }}
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
    </>
  );
};
