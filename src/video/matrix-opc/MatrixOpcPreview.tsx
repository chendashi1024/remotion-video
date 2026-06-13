import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { HudPanel } from "./components/HudPanel";
import { MatrixBaseOverlay } from "./MatrixBaseOverlay";
import { MatrixBackdrop } from "./components/MatrixBackdrop";
import { MetricCard } from "./components/MetricCard";
import { PipelineStrip } from "./components/PipelineStrip";
import { matrixOpcTheme } from "./theme";

const previewSteps = ["机会扫描", "结构拆解", "风险判断", "行动建议", "数据回流"];

export const MatrixOpcPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const activeIndex = Math.min(previewSteps.length - 1, Math.floor((frame / durationInFrames) * previewSteps.length));
  const panelOpacity = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panelX = interpolate(frame, [4, 24], [-34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: matrixOpcTheme.colors.bg, overflow: "hidden" }}>
      <MatrixBackdrop frame={frame} density="medium" transparent={false} />
      <div
        style={{
          position: "absolute",
          left: matrixOpcTheme.layout.leftPanelX,
          top: matrixOpcTheme.layout.leftPanelY,
          width: 820,
          opacity: panelOpacity,
          transform: `translateX(${panelX}px)`,
          fontFamily: matrixOpcTheme.fontFamily,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
          <div
            style={{
              width: 104,
              height: 104,
              display: "grid",
              placeItems: "center",
              border: `1px solid ${matrixOpcTheme.colors.green}`,
              clipPath: "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)",
              color: matrixOpcTheme.colors.green,
              fontSize: 72,
              fontWeight: 1000,
              boxShadow: matrixOpcTheme.shadow.green,
            }}
          >
            C
          </div>
          <div>
            <div
              style={{
                color: matrixOpcTheme.colors.greenHot,
                fontSize: 56,
                lineHeight: 1,
                fontWeight: 1000,
                letterSpacing: 1,
                textShadow: matrixOpcTheme.shadow.greenSoft,
              }}
            >
              C哥OPC 决策面板
            </div>
            <div
              style={{
                marginTop: 10,
                color: matrixOpcTheme.colors.text,
                fontFamily: matrixOpcTheme.monoFont,
                fontSize: 21,
                letterSpacing: 4,
              }}
            >
              DATA COMMAND CENTER
            </div>
          </div>
        </div>
        <HudPanel title="系统状态" label="SYSTEM STATUS" style={{ paddingBottom: 22 }}>
          <div style={{ padding: "22px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
            <MetricCard label="机会强度" value="85%" subValue="强" />
            <MetricCard label="适配度" value="72%" subValue="高" />
            <MetricCard label="复用价值" value="90%" subValue="极高" />
            <MetricCard label="风险等级" value="中" subValue="Medium" accent="orange" />
          </div>
        </HudPanel>
        <HudPanel title="内容生产管线" label="SYSTEM PIPELINE" style={{ marginTop: 16, paddingBottom: 24 }}>
          <div style={{ padding: "24px 24px 6px" }}>
            <PipelineStrip items={["热点", "文章", "脚本", "视频", "发布", "回流"]} />
          </div>
        </HudPanel>
      </div>
      <div
        style={{
          position: "absolute",
          right: 72,
          top: 170,
          width: 520,
          height: 520,
          border: `1px solid rgba(40,245,154,0.14)`,
          borderRadius: "50%",
          opacity: 0.34,
          boxShadow: `inset 0 0 50px rgba(40,245,154,0.12), ${matrixOpcTheme.shadow.greenSoft}`,
        }}
      />
      <MatrixBaseOverlay
        steps={previewSteps.map((title) => ({ title }))}
        activeIndex={activeIndex}
        progress={frame / Math.max(durationInFrames - 1, 1)}
      />
    </AbsoluteFill>
  );
};
