import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BrandSignature } from "./components/BrandSignature";

export const MatrixBrandLayer: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <BrandSignature frame={frame} />
    </AbsoluteFill>
  );
};

