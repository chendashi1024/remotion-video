import { AbsoluteFill, Easing, Img, interpolate, staticFile, useVideoConfig } from "remotion";
import type { VfxBriefItem, VfxComponentProps } from "../../types";
import { accentForStatus, enterProgress, exitOpacity, numberFrom, opcHud, springIn, textProp, toTextList } from "../../design-language";
import { DataPill, ScanSweep, SystemHeader, SystemPanel } from "./FramePrimitives";

const panelStyle = {
  top: opcHud.layout.panelY,
  left: opcHud.layout.panelX,
  width: opcHud.layout.panelWidth,
  minHeight: opcHud.layout.panelHeight,
  padding: "28px 30px 34px",
};

const fullPanelStyle = {
  top: opcHud.layout.fullY,
  left: opcHud.layout.fullX,
  width: opcHud.layout.fullWidth,
  minHeight: opcHud.layout.fullHeight,
  padding: "32px 36px",
};

type ChartDatum = Record<string, string | number>;

const getComponentProps = (effect: VfxBriefItem) => effect.componentProps ?? {};

const getTitle = (effect: VfxBriefItem, fallback: string) =>
  textProp(getComponentProps(effect), "title", effect.title || effect.mainTitle || effect.name || fallback);

const getTakeaway = (effect: VfxBriefItem, fallback: string) =>
  textProp(getComponentProps(effect), "takeaway", effect.takeaway || effect.conclusion || effect.footerText || fallback);

const resolveImageSrc = (imagePath?: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("file://")) return imagePath;
  if (imagePath.startsWith("/")) return `file://${imagePath}`;
  return staticFile(imagePath);
};

const splitShort = (value: string, fallback: string[] = []) => toTextList(value, fallback).slice(0, 5);

const formatCurrency = (value: number, currency?: string) => {
  if (currency === "USD") return `$${value.toLocaleString("en-US")}`;
  if (currency === "JPY") return `¥${value.toLocaleString("ja-JP")}`;
  if (currency === "none") return value.toLocaleString("zh-CN");
  return `¥${value.toLocaleString("zh-CN")}`;
};

const getChartData = (effect: VfxBriefItem): ChartDatum[] => {
  const props = getComponentProps(effect);
  const direct = effect.chartData ?? effect.data;
  const propData = props.data;
  if (Array.isArray(direct)) return direct;
  if (Array.isArray(propData)) return propData as ChartDatum[];
  const steps = effect.steps?.length ? effect.steps : splitShort(effect.text || effect.proofText || "选题 18|文章 32|脚本 12|成片 4");
  return steps.map((item, index) => ({
    name: item,
    value: Math.max(1, steps.length - index) * 12,
  }));
};

const datumValue = (item: ChartDatum, key: string) => item[key] ?? "";

const LevelBadge: React.FC<{ label: string; accent: string }> = ({ label, accent }) => (
  <div
    style={{
      border: `1px solid ${accent}77`,
      background: `${accent}18`,
      color: accent,
      padding: "7px 10px",
      fontFamily: opcHud.monoFont,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 1.4,
      textTransform: "uppercase",
    }}
  >
    {label}
  </div>
);

export const EvidenceCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const props = getComponentProps(effect);
  const accent = accentForStatus(effect.status);
  const title = getTitle(effect, "证据扫描");
  const takeaway = getTakeaway(effect, "证据必须能支撑口播里的判断。");
  const imagePath = textProp(props, "imagePath", effect.image);
  const imageSrc = resolveImageSrc(imagePath);
  const confidence = numberFrom(props.confidence, effect.confidence ?? 0.86);
  const focus = springIn(frame, 30, 18);

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={fullPanelStyle}>
        <ScanSweep frame={frame} accent={accent} />
        <SystemHeader
          eyebrow={textProp(props, "sourceLabel", effect.sourceLabel || effect.proofLabel || "SOURCE_01")}
          title={textProp(props, "sourceType", effect.sourceType || "evidence")}
          accent={accent}
          meta={`CONFIDENCE ${confidence.toFixed(2)}`}
        />
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1.35fr 0.85fr", gap: 28, alignItems: "stretch" }}>
          <div
            style={{
              position: "relative",
              height: 590,
              border: `1px solid ${opcHud.colors.hairline}`,
              background: "rgba(0,0,0,0.34)",
              overflow: "hidden",
            }}
          >
            {imageSrc ? (
              <Img src={imageSrc} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.86, filter: "saturate(0.86) contrast(1.08)" }} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: opcHud.colors.muted,
                  fontFamily: opcHud.monoFont,
                  fontSize: 22,
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                ASSET PENDING
                <br />
                WAITING FOR VALIDATED EVIDENCE
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: `${18 + focus * 10}%`,
                top: `${22 + focus * 4}%`,
                width: `${44 + focus * 6}%`,
                height: `${26 + focus * 4}%`,
                border: `3px solid ${accent}`,
                boxShadow: `0 0 24px ${accent}66, inset 0 0 18px ${accent}22`,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
            <div>
              <div style={{ color: opcHud.colors.text, fontSize: 48, lineHeight: 1.02, fontWeight: 980 }}>{title}</div>
              <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
                <DataPill label={textProp(props, "privacyMode", "privacy:none")} accent={accent} />
                <DataPill label={textProp(props, "capturedAt", "captured:tracked")} accent={accent} />
                <DataPill label={textProp(props, "assetId", effect.id)} accent={accent} />
              </div>
            </div>
            <div
              style={{
                borderLeft: `4px solid ${accent}`,
                padding: "18px 20px",
                background: `${accent}12`,
                color: opcHud.colors.text,
                fontSize: 30,
                lineHeight: 1.18,
                fontWeight: 880,
              }}
            >
              {takeaway}
            </div>
          </div>
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const CompareCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const accent = accentForStatus(effect.status);
  const props = getComponentProps(effect);
  const leftTitle = textProp(props, "leftTitle", effect.leftLabel || "旧逻辑");
  const rightTitle = textProp(props, "rightTitle", effect.rightLabel || "新逻辑");
  const leftItems = splitShort(textProp(props, "leftText", effect.leftText || "临时选题|临时写稿|临时剪辑"));
  const rightItems = splitShort(textProp(props, "rightText", effect.rightText || "母题库|文章资产|脚本复用"));
  const verdict = textProp(props, "verdict", effect.verdict || effect.footerText || "真正的差异，是流程能不能复用。");
  const slideLeft = interpolate(enterProgress(frame, 0), [0, 1], [-50, 0], { easing: Easing.out(Easing.cubic) });
  const slideRight = interpolate(enterProgress(frame, 4), [0, 1], [60, 0], { easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={fullPanelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "SYSTEM DIFF"} title={getTitle(effect, "对比分析")} accent={accent} />
        <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1fr 170px 1fr", gap: 24, alignItems: "stretch" }}>
          {[
            { title: leftTitle, items: leftItems, transform: slideLeft, active: false },
            { title: rightTitle, items: rightItems, transform: slideRight, active: true },
          ].map((side) => (
            <div
              key={side.title}
              style={{
                minHeight: 470,
                padding: "28px",
                border: `1px solid ${side.active ? accent : opcHud.colors.hairline}`,
                background: side.active ? `${accent}14` : "rgba(0,0,0,0.24)",
                boxShadow: side.active ? `0 0 28px ${accent}33` : "none",
                transform: `translateX(${side.transform}px)`,
              }}
            >
              <div style={{ color: side.active ? accent : opcHud.colors.muted, fontFamily: opcHud.monoFont, fontSize: 20, fontWeight: 900, letterSpacing: 2.2, textTransform: "uppercase" }}>
                {side.title}
              </div>
              <div style={{ marginTop: 28, display: "grid", gap: 16 }}>
                {side.items.map((item, index) => (
                  <div
                    key={`${side.title}-${item}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px 1fr",
                      gap: 14,
                      alignItems: "center",
                      padding: "15px 16px",
                      background: "rgba(0,0,0,0.26)",
                      border: `1px solid ${side.active && index === side.items.length - 1 ? accent : "rgba(40,245,154,0.16)"}`,
                    }}
                  >
                    <span style={{ color: side.active ? accent : opcHud.colors.muted, fontFamily: opcHud.monoFont, fontWeight: 900 }}>{String(index + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 31, lineHeight: 1.12, fontWeight: 900 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )).flatMap((node, index) => (index === 0 ? [node, (
            <div key="center" style={{ display: "grid", placeItems: "center", color: accent, fontFamily: opcHud.monoFont, fontSize: 28, fontWeight: 1000, letterSpacing: 2 }}>
              {effect.centerLabel || "VS"}
            </div>
          )] : [node]))}
        </div>
        <div style={{ marginTop: 28, borderLeft: `4px solid ${accent}`, background: `${accent}12`, padding: "16px 20px", fontSize: 30, lineHeight: 1.18, fontWeight: 900 }}>
          {verdict}
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const MetricCounterCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const props = getComponentProps(effect);
  const accent = accentForStatus(effect.status || effect.trend);
  const startValue = numberFrom(props.startValue, effect.startValue ?? numberFrom(effect.secondaryNumber, 0));
  const endValue = numberFrom(props.endValue, effect.endValue ?? numberFrom(effect.mainNumber || effect.value, 100));
  const progress = enterProgress(frame, 8, Math.min(70, durationInFrames - 18));
  const value = startValue + (endValue - startValue) * progress;
  const decimals = Math.max(0, numberFrom(props.decimals, effect.decimals ?? 0));
  const prefix = textProp(props, "prefix", effect.prefix || "");
  const suffix = textProp(props, "suffix", effect.suffix || effect.unit || "");
  const max = Math.max(Math.abs(endValue), Math.abs(startValue), 1);

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <ScanSweep frame={frame} accent={accent} />
        <SystemHeader eyebrow={effect.eyebrow || "SYSTEM SCAN RESULT"} title={effect.subLabel || effect.name} accent={accent} />
        <div style={{ marginTop: 44, color: opcHud.colors.muted, fontSize: 28, fontWeight: 850 }}>{getTitle(effect, "核心指标")}</div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ color: accent, fontSize: 112, lineHeight: 0.95, fontWeight: 1000, textShadow: `0 0 28px ${accent}44` }}>
            {prefix}
            {value.toFixed(decimals)}
          </span>
          <span style={{ color: opcHud.colors.text, fontSize: 42, fontWeight: 950 }}>{suffix}</span>
        </div>
        <div style={{ marginTop: 32, height: 16, border: `1px solid ${accent}55`, background: "rgba(0,0,0,0.3)" }}>
          <div style={{ width: `${Math.min(100, (Math.abs(value) / max) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${accent}, ${opcHud.colors.greenHot})`, boxShadow: `0 0 18px ${accent}55` }} />
        </div>
        <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <LevelBadge label={`START ${startValue}`} accent={opcHud.colors.muted} />
          <LevelBadge label={`TARGET ${endValue}`} accent={accent} />
        </div>
        <div style={{ marginTop: 42, fontSize: 30, lineHeight: 1.18, fontWeight: 900 }}>{getTakeaway(effect, "数字变化必须服务口播结论。")}</div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const FlowPipelineCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const accent = accentForStatus(effect.status);
  const steps = (effect.steps?.length ? effect.steps : splitShort(effect.text || "母题库|文章资产|视频脚本|成片发布|数据回流")).slice(0, 7);
  const active = effect.highlightStep ?? Math.min(steps.length - 1, Math.floor((enterProgress(frame, 10, 70) * steps.length)));

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={fullPanelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "CONTENT PIPELINE"} title={getTitle(effect, "流程编排")} accent={accent} />
        <div style={{ marginTop: 52, position: "relative", display: "grid", gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`, gap: 14 }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 57, height: 2, background: `linear-gradient(90deg, ${accent}88, ${accent}22)` }} />
          {steps.map((step, index) => {
            const p = enterProgress(frame, index * 7, 14);
            const isActive = index === active;
            const done = index <= active;
            return (
              <div key={step} style={{ position: "relative", minWidth: 0, opacity: 0.45 + p * 0.55, transform: `translateY(${(1 - p) * 26}px)` }}>
                <div
                  style={{
                    width: 114,
                    height: 114,
                    margin: "0 auto",
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${done ? accent : opcHud.colors.mutedDeep}`,
                    background: isActive ? `${accent}22` : done ? `${accent}10` : "rgba(0,0,0,0.28)",
                    boxShadow: isActive ? `0 0 26px ${accent}55` : "none",
                    color: done ? accent : opcHud.colors.muted,
                    fontFamily: opcHud.monoFont,
                    fontSize: 28,
                    fontWeight: 1000,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ marginTop: 22, color: isActive ? opcHud.colors.text : opcHud.colors.muted, fontSize: 26, lineHeight: 1.12, fontWeight: isActive ? 950 : 760, textAlign: "center" }}>
                  {step}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 82, borderTop: `1px solid ${accent}44`, paddingTop: 22, fontSize: 34, lineHeight: 1.14, fontWeight: 940 }}>
          {getTakeaway(effect, "闭环不是把流程画出来，而是让数据回到下一次决策。")}
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const TerminalLogCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const props = getComponentProps(effect);
  const logs = effect.logs?.length
    ? effect.logs
    : splitShort(textProp(props, "logs", effect.text || "analyzing topic cluster...|generating article asset...|matching evidence cards...|render queue created.")).map((text, index) => ({
        time: `00:${String(index * 3 + 1).padStart(2, "0")}`,
        level: index === 3 ? "success" : "info",
        text,
      }));

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={opcHud.colors.green} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "TERMINAL LOG"} title={getTitle(effect, "系统执行日志")} />
        <div style={{ marginTop: 34, display: "grid", gap: 14, fontFamily: opcHud.monoFont }}>
          {logs.slice(0, 8).map((log, index) => {
            const p = enterProgress(frame, index * 9, 6);
            const accent = log.level === "error" ? opcHud.colors.red : log.level === "warning" ? opcHud.colors.orange : log.level === "success" ? opcHud.colors.greenHot : opcHud.colors.green;
            return (
              <div key={`${log.text}-${index}`} style={{ opacity: p, display: "grid", gridTemplateColumns: "74px 90px 1fr", gap: 14, alignItems: "center", color: opcHud.colors.text, fontSize: 20 }}>
                <span style={{ color: opcHud.colors.muted }}>{log.time || `00:${String(index).padStart(2, "0")}`}</span>
                <span style={{ color: accent, fontWeight: 900 }}>{log.level || "info"}</span>
                <span style={{ color: accent }}>{">"} {log.text}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 36, color: opcHud.colors.green, fontFamily: opcHud.monoFont, fontSize: 24 }}>
          <span style={{ opacity: frame % 24 < 12 ? 1 : 0.25 }}>█</span>
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const QuoteCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const accent = effect.tone === "warning" ? opcHud.colors.orange : effect.tone === "sharp" ? opcHud.colors.red : opcHud.colors.green;
  const quote = effect.quote || effect.text || effect.mainTitle || effect.name || "普通人做内容，不要每一次都从零开始。";
  const lines = splitShort(quote).slice(0, 3);
  const scale = 0.96 + springIn(frame, 30) * 0.04;

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={{ ...fullPanelStyle, display: "grid", placeItems: "center" }}>
        <div style={{ transform: `scale(${scale})`, maxWidth: 1220, textAlign: "center" }}>
          <div style={{ color: accent, fontFamily: opcHud.monoFont, fontSize: 20, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>
            {effect.authorLabel || effect.eyebrow || "SYSTEM CONCLUSION"}
          </div>
          <div style={{ marginTop: 34, display: "grid", gap: 14 }}>
            {lines.map((line) => (
              <div key={line} style={{ fontSize: 66, lineHeight: 1.04, fontWeight: 1000, letterSpacing: 0 }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const CostCard: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const amountEnd = effect.amountEnd ?? numberFrom(effect.mainNumber || effect.value, 3000);
  return (
    <MetricCounterCard
      effect={{
        ...effect,
        eyebrow: effect.eyebrow || "COST MAP",
        title: getTitle(effect, "成本扫描"),
        startValue: effect.amountStart ?? 0,
        endValue: amountEnd,
        prefix: effect.currency === "USD" ? "$" : effect.currency === "none" ? "" : "¥",
        suffix: effect.period === "monthly" ? "/月" : effect.period === "per_video" ? "/条" : "",
        status: effect.riskLevel === "high" ? "danger" : effect.riskLevel === "medium" ? "warning" : "good",
        conclusion: getTakeaway(effect, "成本不是单点价格，而是整条链路的损耗。"),
      }}
      frame={frame}
      durationInFrames={durationInFrames}
    />
  );
};

export const BarChartPanel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const data = getChartData(effect).slice(0, 6);
  const accent = accentForStatus(effect.status);
  const valueKey = effect.yKey || effect.valueKey || "value";
  const nameKey = effect.xKey || effect.nameKey || "name";
  const max = Math.max(...data.map((item) => numberFrom(datumValue(item, valueKey), 0)), 1);

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "BAR CHART"} title={getTitle(effect, "数据对比")} accent={accent} />
        <div style={{ marginTop: 40, display: "grid", gap: 18 }}>
          {data.map((item, index) => {
            const value = numberFrom(datumValue(item, valueKey), 0);
            const p = enterProgress(frame, index * 5, 18);
            return (
              <div key={`${String(datumValue(item, nameKey))}-${index}`} style={{ display: "grid", gridTemplateColumns: "140px 1fr 90px", gap: 16, alignItems: "center" }}>
                <div style={{ color: opcHud.colors.muted, fontSize: 22, fontWeight: 820, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(datumValue(item, nameKey))}</div>
                <div style={{ height: 28, background: "rgba(0,0,0,0.28)", border: `1px solid ${opcHud.colors.hairline}` }}>
                  <div style={{ height: "100%", width: `${(value / max) * p * 100}%`, background: `linear-gradient(90deg, ${accent}, ${opcHud.colors.greenHot})`, boxShadow: `0 0 18px ${accent}55` }} />
                </div>
                <div style={{ color: accent, fontFamily: opcHud.monoFont, fontSize: 22, fontWeight: 900 }}>{value}{effect.unit || ""}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 38, fontSize: 28, lineHeight: 1.16, fontWeight: 900 }}>{getTakeaway(effect, "图表只服务一个口播判断。")}</div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const LineChartPanel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const data = getChartData(effect).slice(0, 8);
  const accent = accentForStatus(effect.status);
  const valueKey = effect.yKey || effect.valueKey || "value";
  const nameKey = effect.xKey || effect.nameKey || "name";
  const max = Math.max(...data.map((item) => numberFrom(datumValue(item, valueKey), 0)), 1);
  const progress = enterProgress(frame, 8, 56);
  const points = data.map((item, index) => {
    const x = 42 + (index / Math.max(1, data.length - 1)) * 650;
    const y = 350 - (numberFrom(datumValue(item, valueKey), 0) / max) * 260;
    return { x, y, label: String(datumValue(item, nameKey)) };
  });
  const visiblePoints = points.slice(0, Math.max(2, Math.ceil(points.length * progress)));
  const path = visiblePoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "LINE CHART"} title={getTitle(effect, "趋势扫描")} accent={accent} />
        <svg width="760" height="420" style={{ marginTop: 28, overflow: "visible" }}>
          {[0, 1, 2, 3].map((line) => (
            <line key={line} x1={36} x2={720} y1={90 + line * 78} y2={90 + line * 78} stroke={opcHud.colors.hairline} strokeWidth={1} opacity={0.5} />
          ))}
          <path d={path} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" filter="drop-shadow(0 0 8px rgba(40,245,154,0.55))" />
          {visiblePoints.map((point) => (
            <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r={6} fill={accent} />
          ))}
        </svg>
        <div style={{ display: "flex", gap: 12, color: opcHud.colors.muted, fontFamily: opcHud.monoFont, fontSize: 12 }}>
          {points.map((point) => <span key={point.label}>{point.label}</span>)}
        </div>
        <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.16, fontWeight: 900 }}>{getTakeaway(effect, "趋势要解释变化，不只是展示曲线。")}</div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const DonutChartPanel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const data = getChartData(effect).slice(0, 5);
  const accent = accentForStatus(effect.status);
  const valueKey = effect.valueKey || "value";
  const nameKey = effect.nameKey || "name";
  const total = Math.max(1, data.reduce((sum, item) => sum + numberFrom(datumValue(item, valueKey), 0), 0));
  const progress = enterProgress(frame, 8, 48);
  let offset = 0;
  const radius = 128;
  const circumference = 2 * Math.PI * radius;

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "DONUT CHART"} title={getTitle(effect, "结构占比")} accent={accent} />
        <div style={{ marginTop: 38, display: "grid", gridTemplateColumns: "330px 1fr", gap: 34, alignItems: "center" }}>
          <svg width="320" height="320">
            <circle cx="160" cy="160" r={radius} fill="none" stroke="rgba(40,245,154,0.12)" strokeWidth="34" />
            {data.map((item, index) => {
              const value = numberFrom(datumValue(item, valueKey), 0);
              const length = (value / total) * circumference * progress;
              const dashOffset = -offset;
              offset += (value / total) * circumference;
              const color = [accent, opcHud.colors.blue, opcHud.colors.orange, opcHud.colors.yellow, opcHud.colors.red][index % 5];
              return (
                <circle
                  key={String(datumValue(item, nameKey))}
                  cx="160"
                  cy="160"
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="34"
                  strokeDasharray={`${length} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 160 160)"
                />
              );
            })}
            <text x="160" y="154" textAnchor="middle" fill={accent} fontSize="42" fontWeight="900">{Math.round(total)}</text>
            <text x="160" y="190" textAnchor="middle" fill={opcHud.colors.muted} fontSize="16" fontWeight="800">TOTAL</text>
          </svg>
          <div style={{ display: "grid", gap: 14 }}>
            {data.map((item, index) => {
              const color = [accent, opcHud.colors.blue, opcHud.colors.orange, opcHud.colors.yellow, opcHud.colors.red][index % 5];
              return <DataPill key={String(datumValue(item, nameKey))} label={`${String(datumValue(item, nameKey))} ${numberFrom(datumValue(item, valueKey), 0)}`} accent={color} />;
            })}
          </div>
        </div>
        <div style={{ marginTop: 34, fontSize: 28, lineHeight: 1.16, fontWeight: 900 }}>{getTakeaway(effect, "占比要指向资源分配或内容结构。")}</div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const ProgressGauge: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const value = Math.max(0, Math.min(100, numberFrom(effect.value || effect.mainNumber, 68)));
  const accent = accentForStatus(effect.status || effect.riskLevel);
  const progress = enterProgress(frame, 8, 50) * value;
  const radius = 160;
  const circumference = 2 * Math.PI * radius;

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "PROGRESS GAUGE"} title={getTitle(effect, "进度检测")} accent={accent} />
        <div style={{ marginTop: 38, display: "grid", placeItems: "center" }}>
          <svg width="430" height="430">
            <circle cx="215" cy="215" r={radius} fill="none" stroke="rgba(40,245,154,0.12)" strokeWidth="28" />
            <circle
              cx="215"
              cy="215"
              r={radius}
              fill="none"
              stroke={accent}
              strokeWidth="28"
              strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
              transform="rotate(-90 215 215)"
            />
            <text x="215" y="212" textAnchor="middle" fill={accent} fontSize="76" fontWeight="1000">{Math.round(progress)}%</text>
            <text x="215" y="258" textAnchor="middle" fill={opcHud.colors.muted} fontSize="18" fontWeight="900">SYSTEM COVERAGE</text>
          </svg>
        </div>
        <div style={{ marginTop: 8, fontSize: 28, lineHeight: 1.16, fontWeight: 900 }}>{getTakeaway(effect, "进度不是目的，下一步动作才是目的。")}</div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const AgentStatusPanel: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const agents = (effect.nodes?.length ? effect.nodes : splitShort(effect.text || "Topic Agent|Script Agent|Asset Agent|Render Agent|Data Agent")).slice(0, 6);
  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={opcHud.colors.green} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "AGENT STATUS"} title={getTitle(effect, "工作流节点")} />
        <div style={{ marginTop: 34, display: "grid", gap: 14 }}>
          {agents.map((agent, index) => {
            const p = enterProgress(frame, index * 6, 10);
            const status = index < agents.length - 1 ? "running" : "queued";
            const accent = status === "running" ? opcHud.colors.green : opcHud.colors.orange;
            return (
              <div key={agent} style={{ opacity: p, display: "grid", gridTemplateColumns: "1fr 120px", gap: 16, alignItems: "center", padding: "16px 18px", border: `1px solid ${accent}55`, background: `${accent}10` }}>
                <div style={{ fontSize: 28, fontWeight: 900 }}>{agent}</div>
                <LevelBadge label={status} accent={accent} />
              </div>
            );
          })}
        </div>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const NetworkGraph: React.FC<VfxComponentProps> = ({ effect, frame, durationInFrames }) => {
  const opacity = exitOpacity(frame, durationInFrames);
  const nodes = (effect.nodes?.length ? effect.nodes : splitShort(effect.text || "母题库|文章库|脚本库|素材库|发布|数据")).slice(0, 8);
  const accent = accentForStatus(effect.status);
  const { fps } = useVideoConfig();
  const pulse = springIn(frame, fps, 6);
  const cx = 410;
  const cy = 310;
  const radius = 220;

  return (
    <AbsoluteFill style={{ fontFamily: opcHud.fontFamily, color: opcHud.colors.text, opacity }}>
      <SystemPanel accent={accent} style={panelStyle}>
        <SystemHeader eyebrow={effect.eyebrow || "NETWORK GRAPH"} title={getTitle(effect, "资产网络")} accent={accent} />
        <svg width="760" height="520" style={{ marginTop: 20 }}>
          {nodes.map((node, index) => {
            const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            return <line key={`line-${node}`} x1={cx} y1={cy} x2={x} y2={y} stroke={accent} strokeWidth={1.5} opacity={0.25 + pulse * 0.35} />;
          })}
          <circle cx={cx} cy={cy} r={58 + pulse * 8} fill={`${accent}1f`} stroke={accent} strokeWidth={2} />
          <text x={cx} y={cy + 6} textAnchor="middle" fill={accent} fontSize="20" fontWeight="900">OPC</text>
          {nodes.map((node, index) => {
            const p = enterProgress(frame, index * 5, 12);
            const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            return (
              <g key={node} opacity={p}>
                <circle cx={x} cy={y} r={42} fill="rgba(0,18,14,0.92)" stroke={accent} strokeWidth={2} />
                <text x={x} y={y + 6} textAnchor="middle" fill={opcHud.colors.text} fontSize="16" fontWeight="850">{node}</text>
              </g>
            );
          })}
        </svg>
      </SystemPanel>
    </AbsoluteFill>
  );
};

export const chartComponentByType = {
  bar: BarChartPanel,
  line: LineChartPanel,
  donut: DonutChartPanel,
  gauge: ProgressGauge,
};

export const MetricLikeValue: React.FC<{ value: number; currency?: string }> = ({ value, currency }) => (
  <span>{formatCurrency(value, currency)}</span>
);
