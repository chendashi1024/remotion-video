# Remotion → 剪映 视频制作踩坑总结

## 项目概述

用 Remotion（React 编程式视频框架）制作透明背景叠加视频，导入剪映作为口播视频上方的引导特效。

- 分辨率：1920×1080
- 帧率：30fps
- 风格：赛博朋克/暗黑程序员美学
- 输出格式：ProRes 4444 .mov（带 Alpha 透明通道）

---

## 一、项目架构设计

### 1.1 脚本先行工作流

**核心理念：先写脚本，再写组件。**

```
src/compositions/
├── _template/                  ← 新视频模板，复制即用
│   ├── script.md               ← 第一步：定义分镜、文案、时长、风格
│   └── index.tsx               ← 第二步：根据脚本实现动画组件
└── remotion-intro/
    ├── script.md               ← 当前视频的分镜脚本
    └── index.tsx               ← 当前视频的 React 组件
```

**为什么这样做：**
- 脚本是视频的"需求文档"，后续修改视频时知道每个镜头的设计意图
- 多人协作或间隔时间后，看脚本就能快速理解视频结构
- AI 辅助开发时，先读脚本再写组件，效果更好

### 1.2 入口注册

```tsx
// src/Root.tsx — 所有视频在这里注册
<Composition
  id="remotion-intro"           // 用于渲染时指定
  component={RemotionIntro}
  durationInFrames={270}        // 9秒 = 270帧
  fps={30}
  width={1920}
  height={1080}
/>
```

### 1.3 常用命令

```bash
npm run dev           # 启动 Studio，左侧边栏切换视频预览
npm run render        # 渲染 → out/intro.mov
npx remotion render remotion-intro out/intro.mov  # 渲染指定视频
npm run lint          # ESLint + TypeScript 类型检查
```

> **踩坑：`npm run build` 不是渲染视频！** `remotion bundle` 是给服务器端渲染用的，输出的是 JS bundle，不是视频文件。渲染视频用 `remotion render`。

---

## 二、编码格式踩坑（重点）

### 2.1 踩坑历程

| 阶段 | 编码 | 像素格式 | 容器 | 结果 |
|------|------|----------|------|------|
| 默认 | VP8 | yuva420p | WebM | ❌ VP8 不支持 Alpha 通道 |
| 第一次改 | VP9 | yuva420p | WebM | ❌ 剪映对 WebM Alpha 支持差，画面糊 |
| 最终方案 | ProRes 4444 | yuva444p10le | MOV | ✅ 完美 |

### 2.2 为什么要这样改

**VP8/VP9 WebM 的问题：**

- 剪映（CapCut）对 WebM 容器的 Alpha 通道解码支持非常有限
- VP9 虽然在技术标准上支持 Alpha（YUVA），但实际导入剪映后要么丢失透明通道变成黑底，要么解码错误画面糊掉
- 这是剪映本身的问题，换个播放器（Chrome）可以正常显示

**yuva420p 色度采样的问题：**

```
yuv 4:2:0 = 亮度全分辨率 + 颜色 1/4 分辨率
```

- 对于实拍视频影响不大（天然有噪点和运动模糊）
- 但 Remotion 生成的是**矢量文字 + 几何图形**，边缘非常锐利
- 4:2:0 采样会让文字边缘、细线条出现明显的模糊/锯齿/色彩渗漏
- ProRes 4444 + yuva444p10le 是 **4:4:4 采样**，每个像素都有完整的颜色信息

**为什么选 ProRes：**

| 特性 | 说明 |
|------|------|
| 视觉无损 | 几近无损压缩，适合后期处理 |
| Alpha 原生 | ProRes 4444 天然支持透明通道 |
| 剪映兼容 | 剪映 Mac 版对 ProRes 完美支持 |
| 10bit 色深 | 避免渐变色带（banding） |
| 代价 | 文件较大（这个 9 秒视频约 200-400MB） |

### 2.3 最终配置

```ts
// remotion.config.ts
Config.setVideoImageFormat("png");          // 内部帧格式
Config.setPixelFormat("yuva444p10le");      // 4:4:4 + 10bit + Alpha
Config.setCodec("prores");                  // ProRes 编码
Config.setProResProfile("4444");            // 4444 = 带 Alpha
Config.setOverwriteOutput(true);
```

### 2.4 其他踩坑

**`Config.setOutputFormat` 不存在：**

Remotion 4.0.473 没有 `setOutputFormat` 方法。输出格式由 codec 自动决定（prores → .mov，vp9 → .webm）。调用不存在的方法会导致 `npm run dev` 直接报错退���。

**Alpha 模式检测：**

在 Remotion Studio 中默认显示棋盘格背景（表示透明），说明 Alpha 配置正确。如果显示黑色背景，说明像素格式或编码不支持 Alpha。

---

## 三、透明叠加视频的设计要点

### 3.1 不要有实色背景

```tsx
// ❌ 错误：会遮住主视频
<AbsoluteFill style={{ backgroundColor: "#030712" }}>

// ✅ 正确：透明背景，只有浮动元素
<AbsoluteFill style={{ backgroundColor: "transparent" }}>
```

### 3.2 发光效果在透明背景上

- `textShadow` / `drop-shadow` 在透明背景上完全正常
- SVG `feGaussianBlur` 霓虹发光也正常工作
- 不需要深色背景来衬托发光 — 发光元素会在主视频上方自然呈现

### 3.3 避免全屏覆盖效果

- 不要用全屏闪光（会短暂遮住主视频）
- 不要用全屏 Grid/ScanLine（虽然透明度很低但影响主视频观感）
- 元素集中在需要的位置，不要铺满整个画面

### 3.4 组件可以保留半透明背景

```tsx
// ✅ 代码块可以有半透明黑底，这是设计意图
background: "rgba(0, 0, 0, 0.55)"
backdropFilter: "blur(4px)"     // 毛玻璃效果
```

---

## 四、视觉设计经验

### 4.1 程序员/赛博朋克风格元素

适合 AI 知识博主的技术感视觉元素：

| 元素 | 实现方式 |
|------|----------|
| 扫描线 | SVG pattern 4px 间隔横线，不透明度 0.06 |
| 神经网络 | 节点 + SVG line 连线 + 数据点流动 |
| 脉冲环 | 同心圆从小变大，透明度递减 |
| 电路折线 | SVG path 直角折线 |
| 故障文字 | RGB 色散分离：R 通道右移，B 通道左移，mixBlendMode: screen |
| 全息渐变 | HSL 色相循环（hueShift 0→360），background-clip: text |
| 旋转光环 | 多层圆环正反向旋转，stroke-dasharray 描边动画 |

### 4.2 动画节奏

- 使用 ease-out 缓出函数让元素"飞入就位"
- stagger 延迟让多个元素逐个出现
- total 9 秒分 6 个阶段，每个阶段 1-2 秒
- 最后 1.5 秒做整体淡出

---

## 五、工作流建议

### 5.1 制作新视频的流程

1. 复制 `src/compositions/_template/` → 重命名
2. 写 `script.md`，填写所有分镜
3. 根据脚本实现 `index.tsx`
4. 在 `src/Root.tsx` 中注册新的 `<Composition>`
5. `npm run dev` 预览
6. 满意后更新 `package.json` 的 `render` 脚本（或直接命令行渲染）

### 5.2 在剪映中使用

1. 运行 `npm run render` 得到 `out/intro.mov`
2. 剪映新建项目，导入主视频（口播素材）
3. 将 `.mov` 拖入时间轴，放在主视频**上方**的轨道
4. 调整位置和时长
5. 导出

ProRes .mov 已经带透明通道，剪映会自动识别，无需额外设置。

---

## 六、关键文件速查

| 文件 | 作用 |
|------|------|
| `src/Root.tsx` | 注册所有视频 Composition |
| `src/compositions/<name>/script.md` | 视频分镜脚本 |
| `src/compositions/<name>/index.tsx` | 视频 React 组件 |
| `remotion.config.ts` | 渲染编码配置 |
| `package.json` → scripts.render | 渲染命令 |
| `CLAUDE.md` | 项目架构和 AI 辅助开发指南 |
