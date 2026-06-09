import { Easing, interpolate, spring } from "remotion";

export const fadeInOut = (frame: number, durationInFrames: number, intro = 10, outro = 12) =>
  interpolate(frame, [0, intro, durationInFrames - outro, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const slideIn = (frame: number, from: number, axis: "x" | "y" = "y", duration = 16) => {
  const value = interpolate(frame, [0, duration], [from, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return axis === "x" ? `translateX(${value}px)` : `translateY(${value}px)`;
};

export const popIn = (frame: number, fps: number, from = 0.88, to = 1) =>
  spring({
    frame,
    fps,
    from,
    to,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.78,
    },
  });

export const delayedProgress = (frame: number, index: number, gap = 6, duration = 10) =>
  interpolate(frame - index * gap, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const sweepX = (frame: number, width: number, durationInFrames: number) =>
  interpolate(frame, [0, durationInFrames], [-width, width * 1.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
