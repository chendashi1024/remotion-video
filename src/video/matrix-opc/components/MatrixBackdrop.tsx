import { AbsoluteFill, interpolate } from "remotion";
import { matrixOpcTheme } from "../theme";

type MatrixBackdropProps = {
  frame: number;
  density?: "low" | "medium";
  transparent?: boolean;
};

const codeColumns = Array.from({ length: 18 }, (_, index) => ({
  left: 38 + index * 104,
  delay: index * 7,
  opacity: index % 3 === 0 ? 0.16 : 0.08,
}));

export const MatrixBackdrop: React.FC<MatrixBackdropProps> = ({ frame, density = "low", transparent = true }) => {
  const sweep = interpolate(frame % 180, [0, 180], [-260, 1920], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const columnCount = density === "medium" ? codeColumns.length : 10;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparent ? "transparent" : matrixOpcTheme.colors.bg,
        overflow: "hidden",
        fontFamily: matrixOpcTheme.monoFont,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(40,245,154,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(40,245,154,0.1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(90deg, rgba(0,0,0,0.78), rgba(0,0,0,0.2) 48%, transparent 82%)",
        }}
      />
      {codeColumns.slice(0, columnCount).map((column, index) => {
        const y = ((frame * (0.55 + index * 0.02) + column.delay * 18) % 860) - 120;
        return (
          <div
            key={column.left}
            style={{
              position: "absolute",
              left: column.left,
              top: y,
              width: 18,
              color: matrixOpcTheme.colors.green,
              opacity: column.opacity,
              fontSize: 15,
              lineHeight: "24px",
              writingMode: "vertical-rl",
              textShadow: matrixOpcTheme.shadow.greenSoft,
              whiteSpace: "nowrap",
            }}
          >
            OPC_SYSTEM_ASSET_FLOW_010110_SCAN
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: sweep,
          top: 0,
          width: 180,
          height: "100%",
          background:
            "linear-gradient(90deg, transparent, rgba(40,245,154,0.14), rgba(76,255,178,0.08), transparent)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 22% 48%, rgba(40,245,154,0.12), transparent 28%)",
          opacity: 0.58,
        }}
      />
    </AbsoluteFill>
  );
};

