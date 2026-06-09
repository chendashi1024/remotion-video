import "./index.css";
import { Composition } from "remotion";
import { CoverStill, coverCompositions } from "./cover";
import { RemotionIntro } from "./video/remotion-intro";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="remotion-intro"
        component={RemotionIntro}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      {coverCompositions.map((composition) => (
        <Composition
          key={composition.id}
          id={composition.id}
          component={CoverStill}
          durationInFrames={1}
          fps={30}
          width={1080}
          height={1440}
          defaultProps={{
            data: composition.data,
            variant: composition.variant,
          }}
        />
      ))}
    </>
  );
};
