import { interpolate } from "remotion";
import { matrixOpcTheme } from "../theme";

export type MatrixProgressStep = {
  title: string;
  start?: number;
  end?: number;
};

type MatrixProgressNavProps = {
  frame: number;
  steps: MatrixProgressStep[];
  activeIndex: number;
  progress?: number;
};

export const MatrixProgressNav: React.FC<MatrixProgressNavProps> = ({
  frame,
  steps,
  activeIndex,
  progress,
}) => {
  const y = interpolate(frame, [0, 18], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const normalizedProgress =
    progress ?? (steps.length <= 1 ? 1 : Math.min(Math.max(activeIndex / (steps.length - 1), 0), 1));

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 34,
        right: 34,
        height: 68,
        transform: `translateY(${y}px)`,
        fontFamily: matrixOpcTheme.fontFamily,
        color: matrixOpcTheme.colors.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 34,
          height: 1,
          background: "rgba(108,143,130,0.26)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: `${normalizedProgress * 100}%`,
          top: 34,
          height: 2,
          background: `linear-gradient(90deg, rgba(40,245,154,0.95), rgba(76,255,178,0.92))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${normalizedProgress * 100}%`,
          top: 28,
          width: 12,
          height: 12,
          transform: "translateX(-50%) rotate(45deg)",
          background: matrixOpcTheme.colors.green,
        }}
      />
      {steps.slice(1).map((step, index) => {
        const boundaryProgress = (index + 1) / steps.length;
        const passed = boundaryProgress <= normalizedProgress + 0.002;
        return (
          <div
            key={`boundary-${step.title}-${index}`}
            style={{
              position: "absolute",
              left: `${boundaryProgress * 100}%`,
              top: 30,
              width: 8,
              height: 8,
              transform: "translateX(-50%) rotate(45deg)",
              background: passed ? `${matrixOpcTheme.colors.green}cc` : matrixOpcTheme.colors.mutedDeep,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 4,
          height: 48,
        }}
      >
        {steps.map((step, index) => {
          const active = index === activeIndex;
          const segmentStart = index / steps.length;
          const segmentEnd = (index + 1) / steps.length;
          const labelProgress = (segmentStart + segmentEnd) / 2;
          const passed = segmentStart <= normalizedProgress + 0.002;
          return (
            <div
              key={`${step.title}-${index}`}
              style={{
                position: "absolute",
                left: `${labelProgress * 100}%`,
                top: 0,
                width: 190,
                height: 48,
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  color: active ? matrixOpcTheme.colors.green : passed ? "rgba(232,255,245,0.56)" : "rgba(232,255,245,0.32)",
                  fontSize: 14,
                  fontWeight: active ? 900 : 650,
                  letterSpacing: 0.4,
                }}
              >
                {String(index + 1).padStart(2, "0")}. {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
