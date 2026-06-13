export type PersonIntegrationScene =
  | {
      component: "MetricCounterCard";
      start: number;
      duration: number;
      data: {
        label: string;
        startValue: number;
        endValue: number;
        prefix?: string;
        suffix?: string;
        takeaway: string;
        severity: "positive" | "warning" | "danger";
        status: string;
      };
    }
  | {
      component: "EvidenceCard";
      start: number;
      duration: number;
      data: {
        sourceLabel: string;
        sourceType: string;
        asset?: string;
        headline: string;
        takeaway: string;
        confidenceTag: string;
      };
    }
  | {
      component: "CompareCard";
      start: number;
      duration: number;
      data: {
        leftTitle: string;
        rightTitle: string;
        leftItems: string[];
        rightItems: string[];
        highlight: "left" | "right";
        verdict: string;
      };
    }
  | {
      component: "SystemClosure";
      start: number;
      duration: number;
      data: {
        quote: string;
        logs: string[];
        ending: string;
      };
    };

export const personIntegrationDuration = 450;

export const personIntegrationScenes: PersonIntegrationScene[] = [
  {
    component: "MetricCounterCard",
    start: 0,
    duration: 105,
    data: {
      label: "内容生产效率",
      startValue: 0,
      endValue: 83,
      suffix: "%",
      takeaway: "从手工创作，进入系统化生产",
      severity: "positive",
      status: "SYSTEM LOCKED / EFFICIENCY BOOST DETECTED",
    },
  },
  {
    component: "EvidenceCard",
    start: 105,
    duration: 105,
    data: {
      sourceLabel: "ANTHROPIC_DOCS",
      sourceType: "Claude Code 官方文档 / 工作流证据",
      asset: "assets/evidence-anthropic-claude-code-crop.png",
      headline: "这不是观点，而是证据",
      takeaway: "真正重要的不是工具本身，而是它进入了你的工作流",
      confidenceTag: "OFFICIAL / SOURCE LINK",
    },
  },
  {
    component: "CompareCard",
    start: 210,
    duration: 105,
    data: {
      leftTitle: "传统创作",
      rightTitle: "OPC 创作",
      leftItems: ["靠灵感", "每条从零开始", "单次消耗"],
      rightItems: ["靠母题库", "从文章资产转化", "可复利生产"],
      highlight: "right",
      verdict: "真正的差异不是剪辑效率，而是内容有没有资产化。",
    },
  },
  {
    component: "SystemClosure",
    start: 315,
    duration: 135,
    data: {
      quote: "普通人做内容最大的问题，不是不会拍视频，而是每一次都从零开始。",
      logs: [
        "ANALYZING CONTENT SYSTEM...",
        "ASSET PIPELINE DETECTED",
        "SCRIPT MODULE READY",
        "VIDEO WORKFLOW ONLINE",
      ],
      ending: "C哥OPC / CONTENT OPERATING SYSTEM",
    },
  },
];
