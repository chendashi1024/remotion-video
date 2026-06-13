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
  edgeInset?: number;
  variant?: "default" | "chapterStatus";
};

export const MatrixProgressNav: React.FC<MatrixProgressNavProps> = ({
  frame,
  steps,
  activeIndex,
  progress,
  edgeInset = 34,
  variant = "default",
}) => {
  const y = interpolate(frame, [0, 45], [-38, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const normalizedProgress =
    progress ?? (steps.length <= 1 ? 1 : Math.min(Math.max(activeIndex / (steps.length - 1), 0), 1));
  const isChapterStatus = variant === "chapterStatus";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: edgeInset,
        right: edgeInset,
        height: 38,
        transform: `translateY(${y}px)`,
        fontFamily: matrixOpcTheme.fontFamily,
        color: matrixOpcTheme.colors.text,
        background: isChapterStatus ? "rgba(104,108,103,0.58)" : "rgba(0,0,0,0.65)",
        borderRadius: edgeInset === 0 ? 0 : "0 0 4px 4px",
        overflow: "hidden",
      }}
    >
      {isChapterStatus ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${normalizedProgress * 100}%`,
            background: "rgba(0,0,0,0.74)",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 32,
          height: 1,
          background: "rgba(108,143,130,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: `${normalizedProgress * 100}%`,
          top: 32,
          height: isChapterStatus ? 3 : 2,
          background: `linear-gradient(90deg, rgba(40,245,154,0.95), rgba(76,255,178,0.92))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${normalizedProgress * 100}%`,
          top: 26,
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
              top: 28,
              width: 8,
              height: 8,
              transform: "translateX(-50%) rotate(45deg)",
              background: passed ? `${matrixOpcTheme.colors.green}cc` : isChapterStatus ? "rgba(255,255,255,0.55)" : "rgba(108,143,130,0.55)",
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
          height: 24,
        }}
      >
        {steps.map((step, index) => {
          const active = index === activeIndex;
          const segmentStart = index / steps.length;
          const segmentEnd = (index + 1) / steps.length;
          const labelProgress = (segmentStart + segmentEnd) / 2;
          const passed = segmentStart <= normalizedProgress + 0.002;
          const labelColor = isChapterStatus
            ? passed
              ? matrixOpcTheme.colors.green
              : "rgba(255,255,255,0.92)"
            : active
              ? matrixOpcTheme.colors.green
              : passed
                ? "rgba(232,255,245,0.85)"
                : "rgba(232,255,245,0.60)";
          return (
            <div
              key={`${step.title}-${index}`}
              style={{
                position: "absolute",
                left: `${labelProgress * 100}%`,
                top: 0,
                width: 210,
                height: 24,
                transform: "translateX(-50%)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  lineHeight: "24px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  color: labelColor,
                  fontSize: 20,
                  fontWeight: active || (isChapterStatus && passed) ? 900 : 650,
                  letterSpacing: 0.6,
                  textShadow: isChapterStatus && passed ? "0 0 12px rgba(40,245,154,0.28)" : undefined,
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
