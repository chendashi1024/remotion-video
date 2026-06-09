import type { PropsWithChildren } from "react";
import { AbsoluteFill } from "remotion";
import { ScanLine } from "../primitives";
import { programTheme } from "../themes";

type ProgramShellProps = PropsWithChildren<{
  frame: number;
  durationInFrames: number;
  scan?: boolean;
}>;

export const ProgramShell: React.FC<ProgramShellProps> = ({ children, frame, durationInFrames, scan = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", fontFamily: programTheme.fontFamily, color: programTheme.colors.text }}>
      {scan ? <ScanLine frame={frame} durationInFrames={durationInFrames} /> : null}
      {children}
    </AbsoluteFill>
  );
};
