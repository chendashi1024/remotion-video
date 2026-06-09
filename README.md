# Remotion Workflow — 视频 + 封面制作工作流

> 用 React 组件编程生成视频 —— 脚本先行，一键渲染，透明叠加，专为 AI 知识博主的口播视频打造。

## 为什么有这个项目

我是一个程序员，也是一个 AI 知识博主。我需要给口播视频加特效 —— 代码演示、关键概念、炫酷的引导动画。

传统做法是 AE 或剪映关键帧手搓，费时费力，改一个字就要重新调整个时间轴。Remotion 让我用 **React 写视频**，每个动画都是代码，改文案不需要重新做特效。但这个过程中踩了不少坑：编码格式不对导致视频糊掉、透明通道不生效、剪映不兼容 WebM……

这个项目把踩过的坑填平了，提供了一套**可复用的模板和工作流**，让你拿到就能用它做知识分享视频。

## 演示

```
你写好分镜脚本（script.md）
        ↓
用 React 组件实现动画（index.tsx）
        ↓
npm run dev 实时预览
        ↓
npm run render → out/intro.mov（ProRes 4444 + Alpha 透明通道）
        ↓
拖入剪映，放在口播视频上方
```

## 适用场景

- **AI/编程知识博主** — 给口播视频加代码演示、概念动画、引导特效
- **技术讲师** — 制作可复用的视频模板，同一套代码改文案即可生成新视频
- **需要透明叠加视频的人** — 已解决 ProRes 4444 + Alpha 输出，剪映直接兼容

不适合：纯实拍视频剪辑、不需要编程能力、不需要透明通道。

## 30 秒安装

```bash
git clone git@github.com:chendashi1024/remotion-workflow.git
cd remotion-workflow
npm install
npm run dev
```

浏览器打开 Remotion Studio，左侧选中 `remotion-intro` 即可预览。

## 抖音封面 + 视频制作

本项目同时作为 `moqi-opc` 的封面渲染和视频动画制作工具包。

OPC 侧目录约定：

```txt
moqi-opc/视频/<主题>/
├── 脚本.md
└── 素材/
    └── 封面/
        ├── bg.png
        ├── prompt/
        │   ├── bg.prompt.md
        │   └── cover.render.md
        └── 候选/
```

固定人物图：

```txt
moqi-opc/视频/通用素材/person/fixed-person.png
```

生成封面候选：

```bash
npm run cover -- /Users/chenchen/Documents/moqi-opc/视频/<主题>
```

输出：

```txt
moqi-opc/视频/<主题>/素材/封面/候选/cover-impact.png
moqi-opc/视频/<主题>/素材/封面/候选/cover-tech.png
moqi-opc/视频/<主题>/素材/封面/候选/cover-clean.png
```

不要把每期 `bg.png`、提示词或候选封面提交到本仓库。

## 手动安装

### 前置要求

| 组件 | 安装方式 | 用途 |
|------|---------|------|
| Node.js 20+ | `brew install node` | 运行时 |
| npm | 随 Node.js 自带 | 包管理 |
| 剪映专业版 (Mac) | App Store | 视频编辑 |

### 1. 克隆并安装

```bash
git clone git@github.com:chendashi1024/remotion-workflow.git
cd remotion-workflow
npm install
```

### 2. 预览

```bash
npm run dev
```

### 3. 渲染

```bash
npm run render
```

输出 `out/intro.mov`，ProRes 4444 编码，带 Alpha 透明通道。

## 项目结构

```
src/
├── Root.tsx                          ← 注册 cover + video 所有 Composition
├── index.ts                          ← 入口
├── cover/                            ← 封面渲染组件
│   ├── CoverStill.tsx
│   ├── types.ts
│   └── variants.ts
└── video/                            ← 视频动画组件
    ├── _template/                    ← 新视频模板（复制即用）
    │   ├── script.md                 ← 第一步：写分镜脚本
    │   └── index.tsx                 ← 第二步：实现动画组件
    └── remotion-intro/              ← 示例视频
        ├── script.md                 ← 教学视频分镜
        └── index.tsx                 ← React 动画组件
```

## 制作新视频

```
复制 _template/ → 重命名 → 填 script.md → 实现 index.tsx → 在 Root.tsx 注册 → 渲染
```

**把这段话发给 Claude Code：**

> 我在 /src/video/ 下新建了一个 my-video 文件夹，script.md 已经写好了。请根据 script.md 的内容帮我实现 index.tsx，合成参数是 1920x1080 @ 30fps，需要透明背景（用于剪映叠加）。

## 使用

```bash
npm run dev              # 启动 Studio，左侧切换视频预览
npm run render           # 渲染 remotion-intro → out/intro.mov
npm run cover -- /Users/chenchen/Documents/moqi-opc/视频/<主题>
                         # 读取 OPC 素材并导出三张封面候选
npm run lint             # ESLint + TypeScript 检查

# 渲染其他视频
npx remotion render <composition-id> out/output.mov
```

### 在剪映中使用

1. `npm run render` 生成 `out/intro.mov`
2. 剪映导入主视频（口播素材）
3. 将 `.mov` 拖到主视频**上方轨道**
4. ProRes 4444 自带 Alpha 通道，自动识别透明

## 为什么不用其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **本项目 (Remotion)** | 代码驱动，改文案零成本，模板复用，透明通道完整 | 需要 React 基础，渲染耗时 |
| After Effects | 行业标准，效果丰富 | 改文案要重调时间轴，学习曲线陡，收费 |
| 剪映手动关键帧 | 免费，上手快 | 复杂动画难以实现，每个视频从头做 |
| 纯 Remotion 模板 | 官方基础模板 | 没有脚本先行流程，没有剪映适配方案 |

## 工作流

```
和 Claude 深聊（debug/架构/新技术）
        ↓
/knowledge-share → 生成 knowledge-xxx.md（知识文档）
        ↓
转成 script.md（分镜脚本）
        ↓
Claude 实现 index.tsx（动画组件）
        ↓
npm run render → 拖入剪映 → 发布
```

全局 skill `/knowledge-share`（已安装在 `~/.claude/skills/`）：对话后一键提取经验、踩坑、洞察，生成结构化知识文档，含可直接转视频的"教学叙事线"。

## 故障排查

| 问题 | 原因 | 解决 |
|------|------|------|
| 视频在剪映里出现黑底 | 编码或像素格式不支持 Alpha | 确认 `remotion.config.ts` 使用 `prores` + `yuva444p10le` + ProRes profile `4444` |
| 文字/线条边缘模糊 | 使用了 `yuva420p`（4:2:0 色度采样） | 改为 `yuva444p10le`（4:4:4 采样，每个像素完整颜色） |
| `npm run build` 不生成视频 | `remotion bundle` 是 SSR 打包，不是渲染 | 用 `npm run render` 或 `npx remotion render <id> out/xxx.mov` |
| `Config.setOutputFormat is not a function` | Remotion 4.0.473 没有此方法 | 已在 `remotion.config.ts` 中移除 |
| 剪映导入 .webm 失败/画面异常 | 剪映对 WebM Alpha 支持差 | 使用 ProRes 4444 .mov 输出 |
| `npm run dev` 启动报错 | 依赖未安装或冲突 | `rm -rf node_modules && npm install` |

## 踩坑文档

项目根目录下的 `remotion-剪映-踩坑总结.md` 记录了完整的踩坑和解决方案，包括编码格式选择、像素格式对比、透明视频设计要点、视觉风格建议。

## License

MIT
