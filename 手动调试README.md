# Remotion 手动调试说明

这个仓库当前按“双模式”运行：

- **手动调试模式**：Remotion 仓库内保留内置文章样例，`npm run dev` 可直接打开 Studio 调 cover/video。
- **同步调试模式**：先从 `cge-opc` 或其他内容仓库同步文章执行信息到 `src/articles/<slug>/`，再在 Remotion 内手动调试。
- **外部渲染模式**：脚本也可以直接读取外部文章目录，所有产物统一导出到本仓库 `out/<文章slug>/`。

## 推荐目录模型

最终内容资产按文章维度组织：

```txt
文章/<article-slug>/
├── article.md
├── meta.json
├── cover-prompt.md
├── cover-bg.png
├── video-script.md
├── bg-prompt.md
└── music.md
```

生成产物统一平铺到：

```txt
out/<article-slug>/
├── cover-impact.png
├── cover-tech.png
├── cover-poster.png
└── video.mov
```

Remotion 仓库只沉淀可复用能力：

```txt
src/
├── articles/                 # 内置调试文章样例
├── cover/                    # 封面组件、类型、变体
├── video/                    # 视频组件和调试入口
└── shared/                   # 后续抽公共组件、动效、素材
```

## 当前内置样例

```txt
src/articles/demo-opc/
├── meta.json                 # Studio 默认使用的数据
├── cover-prompt.md           # npm run cover:demo 使用的封面说明
└── video-script.md           # 文章视频脚本样例
```

## 同步外部文章

执行信息优先来自外部文章目录。同步脚本会把内容整理成 Remotion 可调试的平铺结构：

```bash
npm run article:sync -- /Users/chenchen/Documents/cge-opc/视频/<主题>/脚本
```

同步后会写入：

```txt
src/articles/<article-slug>/
├── meta.json
├── cover-prompt.md
├── video-script.md
├── bg-prompt.md
└── music.md
```

如果存在背景图，会复制一份到：

```txt
public/articles/<article-slug>/cover-bg.<ext>
```

同步脚本还会自动刷新：

```txt
src/articles/registry.ts
```

所以重新启动 `npm run dev` 后，Studio 左侧会出现新文章的预览入口。

## 手动调试命令

启动 Remotion Studio：

```bash
npm run dev
```

Studio 左侧重点看：

```txt
cover-impact
cover-tech
cover-poster
article-video
article-demo-opc-video
article-demo-opc-cover-impact
```

导出内置文章封面候选：

```bash
npm run cover:demo
```

等价于：

```bash
npm run article:cover
```

输出位置：

```txt
out/demo-opc/
```

导出内置文章视频：

```bash
npm run video:demo
```

等价于：

```bash
npm run article:video
```

输出位置：

```txt
out/demo-opc/video.mov
```

一次生成内置文章的封面和视频：

```bash
npm run article:all
```

或者更短：

```bash
npm run article
```

## 外部文章目录

新结构文章目录可以直接调用：

```bash
npm run article:cover -- src/articles/<article-slug>
npm run article:video -- src/articles/<article-slug>
npm run article:all -- src/articles/<article-slug>
```

脚本会读取：

```txt
src/articles/<article-slug>/cover-prompt.md
src/articles/<article-slug>/cover-bg.png
src/articles/<article-slug>/video-script.md
```

并导出到：

```txt
out/<主题>/
```

## 迭代原则

1. OPC 或外部内容仓库是事实源，Remotion 内的 `src/articles/<slug>` 是调试副本。
2. 先 `article:sync`，再在 `src/articles/<slug>` 手动微调提示词、脚本和 `meta.json`。
3. 具体文章资产不提交到本仓库，生成物统一进 `out/<文章slug>/`。
4. `cover` 和 `video` 是同一篇文章下的并列产物，不互相依附。
