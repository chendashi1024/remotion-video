import "./index.css";
import { Composition } from "remotion";
import { RemotionIntro } from "./compositions/remotion-intro";

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
    </>
  );
};
