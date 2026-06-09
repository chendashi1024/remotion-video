# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev          # 启动 Remotion Studio，左侧边栏切换不同视频预览
npm run build        # 打包视频（SSR bundle）
npm run cover -- /Users/chenchen/Documents/moqi-opc/视频/<主题>
                     # 读取 OPC 视频目录素材，导出 3 张封面候选
npm run lint         # ESLint + TypeScript 类型检查

# 渲染指定视频
npx remotion render <composition-id> out/<output>.webm
# 例如：npx remotion render remotion-intro out/intro.webm
```

## 项目架构

这是一个 **Remotion** 项目 — 用 React 组件以编程方式生成视频。

## OPC 视频 + 封面工作流

本项目是 `moqi-opc` 的 Remotion 工具包，包含封面渲染和视频动画制作两套工作流。每期视频的内容资产（背景、提示词、脚本、候选图等）都归档在 `moqi-opc` 项目中，本仓库只保存可复用的组件、渲染脚本和工具逻辑。

封面渲染入口：

```bash
npm run cover -- /Users/chenchen/Documents/moqi-opc/视频/<主题>
```

脚本会读取：

```txt
视频/<主题>/素材/封面/prompt/cover.render.md
视频/<主题>/素材/封面/bg.png
视频/通用素材/person/fixed-person.png
```

并导出：

```txt
视频/<主题>/素材/封面/候选/cover-impact.png
视频/<主题>/素材/封面/候选/cover-tech.png
视频/<主题>/素材/封面/候选/cover-clean.png
```

不要把每期的 `bg.png`、提示词、脚本或候选封面提交到本仓库；本仓库只是 Remotion 工具包。

### 脚本先行工作流（重要）

**所有视频必须先写脚本，再写组件。**

每个视频文件夹包含两个文件：
```
compositions/<video-name>/
  script.md    ← 第一步：定义视频内容（分镜、文案、时长、风格）
  index.tsx     ← 第二步：根据脚本实现动画组件
```

创建新视频的流程：
1. 复制 `_template/` 文件夹，重命名为视频名
2. 填写 `script.md`，定义所有分镜的详细内容
3. 根据 `script.md` 实现 `index.tsx`
4. 在 `Root.tsx` 中注册新的 `<Composition>`

### 入口与注册

- `src/index.ts` — 入口文件，调用 `registerRoot()` 注册根组件
- `src/Root.tsx` — 根组件，用 `<Composition>` 注册所有视频合成

### 已有视频

- `src/compositions/remotion-intro/` — Remotion 入门介绍（透明背景 + 赛博朋克风格，9秒）
  - 扫描线 · 神经网络连线 · 脉冲环 · 电路折线 · 数据粒子 · 故障文字 · 全息渐变标题
- `src/compositions/_template/` — 新视频模板，复制即用

所有视频统一参数：**1920×1080**，**30fps**

### 样式与配置

- `src/index.css` — 引入 Tailwind CSS v4
- `remotion.config.ts` — Remotion 渲染配置：
  - 图片格式：**PNG**（支持透明通道）
  - 像素格式：**YUVA420P**（带 Alpha 通道）
  - 编码器：**ProRes 4444**（.mov 容器，视觉无损 + Alpha 透明通道，剪映完美支持）
  - 像素格式：**yuva444p10le**（4:4:4 色度 + 10bit + Alpha，边缘锐利无锯齿）
  - 不要用 VP9/WebM：剪映对 WebM Alpha 支持差，且 yuva420p 色度采样导致文字模糊
  - 输出时自动覆盖已有文件
  - 通过 `enableTailwind` 启用 Tailwind v4

### Remotion 核心概念

- **Composition** — 定义一个视频的元信息（时长、分辨率、fps），指向一个 React 组件
- **useCurrentFrame()** — 获取当前帧号，用于驱动动画。所有动画都基于帧号计算，不是基于时间
- **useVideoConfig()** — 获取 fps、durationInFrames、width、height
- **interpolate()** — 将帧进度映射到动画值范围，支持 `extrapolateLeft/Right: "clamp"`
- **AbsoluteFill** — 绝对定位填满整个画布的 `<div>`
