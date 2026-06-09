import { Easing, interpolate, spring } from "remotion";

export const appear = (frame: number, durationInFrames: number) => {
  const opacity = interpolate(frame, [0, 10, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return opacity;
};

export const softScale = (frame: number, fps: number) =>
  spring({
    frame,
    fps,
    from: 0.88,
    to: 1,
    config: {
      damping: 13,
      stiffness: 170,
      mass: 0.8,
    },
  });

export const slideY = (frame: number, from: number, to = 0) =>
  interpolate(frame, [0, 14], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const itemProgress = (frame: number, index: number, gap = 7) =>
  interpolate(frame - index * gap, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
