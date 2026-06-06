# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
npm run dev          # 启动 Remotion Studio 预览
npm run build        # 打包视频（SSR bundle）
npm run lint         # ESLint + TypeScript 类型检查
npx remotion render  # 渲染视频到 out/ 目录
```

## 项目架构

这是一个 **Remotion** 项目 — 用 React 组件以编程方式生成视频。

### 入口与注册

- `src/index.ts` — 入口文件，调用 `registerRoot()` 注册根组件
- `src/Root.tsx` — 根组件，用 `<Composition>` 注册所有视频合成。**新增合成就在这里加**

### 视频组件

所有视频组件放在 `src/compositions/` 下，每个视频一个子文件夹，用 `index.tsx` 导出组件。

- `src/compositions/remotion-intro/` — Remotion 入门介绍视频（暗黑炫酷风格）

合成参数：**1920×1080**，**30fps**，**270帧（9秒）**

### remotion-intro 动画时间线

1. **0–0.5s**：暗场渐亮
2. **0.5–2s**：三个关键词（React、组件、渲染）从不同方向飞入
3. **2–4.5s**：中央几何图形（旋转双环 + 六边形）构建动画
4. **4.5–6.5s**：主标题 "Remotion" 渐变文字出现
5. **6.5–7.5s**：副标题 "用 React 创作视频" + 代码行展示
6. **7.5–9s**：粒子扩散、闪光、整体淡出

### 视觉风格

- 暗黑背景 `#030712`
- 霓虹发光效果（SVG feGaussianBlur 滤镜）
- 蓝紫青渐变配色（#3b82f6 / #8b5cf6 / #06b6d4）
- 等宽字体（JetBrains Mono）
- 网格背景 + 粒子系统

### 样式与配置

- `src/index.css` — 引入 Tailwind CSS v4
- `remotion.config.ts` — Remotion 渲染配置：
  - 图片格式：**PNG**（支持透明通道）
  - 像素格式：**YUVA420P**（带 Alpha 通道）
  - 编码器：**VP8**
  - 输出时自动覆盖已有文件
  - 通过 `enableTailwind` 启用 Tailwind v4

### Remotion 核心概念

- **Composition** — 定义一个视频的元信息（时长、分辨率、fps），指向一个 React 组件
- **useCurrentFrame()** — 获取当前帧号，用于驱动动画。所有动画都基于帧号计算，不是基于时间
- **useVideoConfig()** — 获取 fps、durationInFrames、width、height
- **interpolate()** — 将帧进度映射到动画值范围，支持 `extrapolateLeft/Right: "clamp"`
- **AbsoluteFill** — 绝对定位填满整个画布的 `<div>`
