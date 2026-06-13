# OPC Remotion 标准

## 定位

Remotion Workflow 是 OPC 视频的“内容可视化操作系统”，不是完整剪辑软件，也不是一次性科技皮肤。

主视频仍然由真人口播、字幕、BGM 和剪映节奏完成；Remotion 负责生成可复用、可校验、可透明叠加的信息层素材。

```txt
脚本 -> Brief -> 素材策略 -> 素材清单 / 待处理清单 -> Remotion VFX -> 剪映叠加
```

## 设计语言

统一视觉方向：

```txt
Matrix HUD / cyber terminal / green analysis system / OPC content OS
```

基础规则：

- 背景透明，导出 ProRes 4444 `.mov`。
- 主信息区默认在左侧，保留右侧人物安全区。
- 底部 20%-25% 留给剪映字幕。
- 使用绿色为主色，红色只表示风险，橙色只表示警告，蓝色只表示辅助信息。
- 所有动画由帧驱动，不使用 CSS animation 或 transition。
- 信息组件必须服务口播判断，不做纯装饰。

## 组件标准

当前可由 `[自动][VFX-xxx][类型]` 直接调用的标准组件：

| 类型 | 用途 |
| --- | --- |
| `EvidenceCard` | 证据截图、网页、文档、后台图，并显示来源、置信度和结论 |
| `CompareCard` | 旧逻辑 vs 新逻辑、A vs B、手工 vs 系统 |
| `MetricCounterCard` | 核心数字滚动、效率、比例、数量 |
| `FlowPipelineCard` | OPC 流程、素材链路、数据回流 |
| `TerminalLogCard` | 系统执行日志、任务队列 |
| `QuoteCard` | 核心判断、金句、结尾结论 |
| `CostCard` | 成本、价格、节省金额、风险等级 |
| `BarChartPanel` | 横向对比、排名、成本对比 |
| `LineChartPanel` | 趋势、增长、复利变化 |
| `DonutChartPanel` | 时间分配、内容结构、来源占比 |
| `ProgressGauge` | 自动化覆盖率、进度、风险等级 |
| `AgentStatusPanel` | 多 Agent / 多节点状态 |
| `NetworkGraph` | 资产库、系统结构、节点关系 |

原有组件仍保留：

```txt
ProgramPackage / ConceptContrast / StepSystem / RiskPackage / InfraNetwork /
MilestoneNumber / RevenueSignal / ProofCard / NextEpisodePackage / AtmosphereOverlay
```

## Brief 字段

最低字段：

```txt
🎬 [自动][VFX-001][EvidenceCard]
- 场景ID：S03
- 锚点：很多人以为 AI 工具贵，但真正贵的是混乱流程。
- 名称：成本证据
- 来源标签：SOURCE_01
- 来源类型：official_website
- 图片：/absolute/path/to/screenshot.png
- 标题：工具价格不是全部成本
- 结论：真正要算的是整条生产链路成本
- 可信度：0.86
- 素材策略：{"required":true,"preferred_mode":"auto_web_capture","validation":{"minimum_confidence":0.8}}
- 动效：扫描进入，高亮重点区域
- 建议时长：5秒
- 导出命名：VFX-001-EvidenceCard-成本证据.mov
```

支持的增强字段：

```txt
组件参数：JSON object，直接传给组件
素材策略：JSON object，覆盖默认 asset_strategy
图表数据：JSON array，用于 BarChartPanel / LineChartPanel / DonutChartPanel
日志：用 | 分隔，用于 TerminalLogCard
步骤：用 | 分隔，用于 FlowPipelineCard
节点：用 | 分隔，用于 NetworkGraph / AgentStatusPanel
风险等级：low / medium / high
状态：good / warning / danger / neutral
```

## 素材输入

推荐放置位置：

```txt
cge-opc/视频/<主题>/素材/
├── raw/
├── evidence/
├── screenshots/
└── remotion-assets/
```

执行：

```bash
npm run brief:build -- /Users/chenchen/Documents/cge-opc/视频/<主题>/脚本
npm run assets:prepare -- /Users/chenchen/Documents/cge-opc/视频/<主题>/脚本
npm run vfx -- /Users/chenchen/Documents/cge-opc/视频/<主题>/脚本
```

产物：

```txt
out/<主题>/brief/brief.json
out/<主题>/assets/asset_manifest.json
out/<主题>/assets/action_required.json
cge-opc/视频/<主题>/素材/remotion-brief/brief.json
cge-opc/视频/<主题>/素材/remotion-assets/asset_manifest.json
cge-opc/视频/<主题>/素材/remotion-assets/action_required.json
```

## 素材校验原则

- 文件名只做路径索引，不作为内容判断依据。
- `EvidenceCard` 默认需要素材校验。
- 没有素材、置信度低于阈值、隐私风险高，会写入 `action_required.json`。
- `npm run vfx` 会读取 `action_required.json`，存在未解决项时阻止渲染。
- 私有后台、聊天、账号、订单、平台后台截图默认高隐私风险，必须先脱敏。
- 没有可信证据时，降级为 `CompareCard`、`QuoteCard` 或纯文字信息卡，不编造证据。

## 验收标准

- 每个组件 3-6 秒内能看懂。
- 证据卡必须有来源、重点、结论和置信度。
- 对比卡必须有明确左右差异和 verdict。
- 数字卡一屏只强调一个主数字。
- 图表必须解释口播里的判断，不展示无意义数据。
- 输出必须是透明 `.mov`，不生成完整成片。
