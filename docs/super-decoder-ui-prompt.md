# Super Decoder — UI 界面开发 Prompt

> **用途**：将此 Prompt 完整喂给 Claude Code，用于生成跨平台手机游戏的完整 UI 界面代码。

---

## Prompt 正文

你是一位资深前端工程师兼 UI 设计师。请根据以下规格，为 **Super Decoder 解密游戏** 构建一个完整的、可运行的跨平台手机游戏应用。

---

### 一、技术栈要求

| 项目 | 选择 | 理由 |
|------|------|------|
| 框架 | **React + TypeScript** 构建为 **PWA (Progressive Web App)** | 一套代码同时在 iPhone Safari、Android Chrome、iPad 上运行，无需上架应用商店 |
| 样式方案 | **Tailwind CSS** + 自定义 CSS Variables（用于 LED 发光效果） | 快速响应式布局 |
| 动画 | **Framer Motion** | 流畅的组件进场、提示灯亮起、胜利/失败动画 |
| 音效 | **Howler.js** 或 **Web Audio API** | 莫尔斯电码风格音效 |
| 状态管理 | **Zustand** | 轻量，适合游戏状态 |
| 持久化 | **localStorage** (通过 Zustand persist 中间件) | 保存关卡进度和设置 |
| 构建工具 | **Vite** | 快速开发和构建 |
| PWA 支持 | **vite-plugin-pwa** | 离线缓存、添加到主屏幕 |

**初始化命令参考**：
```bash
npm create vite@latest super-decoder -- --template react-ts
cd super-decoder
npm install tailwindcss @tailwindcss/vite framer-motion zustand howler vite-plugin-pwa
npm install -D @types/howler
```

---

### 二、设计美学方向

**核心关键词：Retro-Futuristic LED Console（复古未来主义 LED 控制台）**

这不是一个普通的扁平化手机 App，而是一个**数字化复刻的实体解密设备**。整个 UI 要让用户感觉自己在操作一台精密的间谍解码器。

#### 2.1 视觉参考
- 想象一台 80 年代科幻电影中的解码终端
- LED 点阵屏的颗粒感与现代玻璃拟态（glassmorphism）的融合
- 深色为主，霓虹色发光元素点缀
- 类似于：Fallout 的 Pip-Boy 终端 × 赛博朋克控制面板 × 实体 设备

#### 2.2 配色系统

```css
:root {
  /* 背景层 */
  --bg-deepest: #0A0A12;        /* 最深层背景 */
  --bg-panel: #12121F;           /* 面板背景 */
  --bg-card: #1A1A2E;            /* 卡片/行背景 */
  --bg-slot: #0F1628;            /* 空槽位背景 */

  /* 文字 */
  --text-primary: #E8E8F0;       /* 主文字 */
  --text-secondary: #6B6B8D;     /* 辅助文字 */
  --text-accent: #00FFAA;        /* 强调文字（数字、状态） */

  /* LED 颜色 - 必须鲜艳，带发光效果 */
  --led-red: #FF2D55;
  --led-blue: #007AFF;
  --led-green: #30D158;
  --led-yellow: #FFD60A;
  --led-orange: #FF9F0A;
  --led-purple: #BF5AF2;
  --led-white: #E8E8F0;
  --led-pink: #FF6EB4;

  /* 提示灯 */
  --hint-correct: #30D158;       /* 绿灯 - 完全正确 */
  --hint-misplaced: #FFFFFF;     /* 白灯 - 位置错 */
  --hint-absent: #2A2A3E;        /* 灭灯 - 不存在 */

  /* 发光效果 */
  --glow-intensity: 0.6;
  --glow-radius: 12px;

  /* 功能色 */
  --success: #30D158;
  --failure: #FF453A;
  --border-subtle: #2A2A4A;
}
```

#### 2.3 字体

```css
/* 主显示字体 - 用于关卡号、计时器等数字显示 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

/* 辅助字体 - 用于按钮文字和说明 */
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&display=swap');

/* 等宽字体 - 用于提示信息 */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
```

- `Orbitron`：用于所有数字显示（关卡号、计时器、统计数据）— 科幻感
- `Exo 2`：用于按钮文字、菜单项、说明文字 — 清晰且有未来感
- `JetBrains Mono`：用于调试信息或代码风格元素（可选）

---

### 三、响应式布局策略

**目标设备尺寸与断点**：

| 设备 | 宽度范围 | 布局策略 |
|------|----------|----------|
| iPhone SE / 小屏手机 | < 375px | 紧凑布局，颜色选择器 2 行 4 列 |
| iPhone 标准 / Android | 375px - 428px | 标准竖屏布局（主力适配尺寸） |
| iPhone Pro Max / 大屏 | 428px - 480px | 稍宽松的间距 |
| iPad Mini 竖屏 | 480px - 768px | 居中卡片布局，最大宽度 480px |
| iPad 竖屏 | 768px - 1024px | 居中卡片，增加装饰元素 |
| iPad 横屏 | > 1024px | 双栏布局可选（游戏板 + 统计信息） |

**核心原则**：
- 游戏主界面**始终居中**，最大宽度 `480px`，在大屏设备上不会被拉伸
- 使用 `dvh`（dynamic viewport height）适配 iOS Safari 的动态地址栏
- 所有触摸目标最小 `44px × 44px`（Apple HIG 要求）
- 支持 Safe Area Insets（刘海屏、底部横条）

```css
/* 安全区域适配 */
.game-container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  min-height: 100dvh;
}
```

---

### 四、页面结构与导航

使用**单页应用（SPA）**，通过状态切换页面（不需要路由库）：

```
App
├── SplashScreen          — 启动画面（LED 文字动画）
├── HomeScreen            — 主菜单
│   ├── → Solo Mode       — 单人模式入口
│   ├── → Duo Mode        — 双人模式入口
│   ├── → Free Play       — 自由模式入口
│   ├── → Statistics      — 统计数据
│   └── → Settings        — 设置
├── GameScreen            — 核心游戏界面
│   ├── GameHeader        — 关卡信息 + 剩余次数
│   ├── GameBoard         — 7 行猜测区域
│   ├── ColorPicker       — 颜色选择器
│   └── GameActions       — 确认/清除按钮
├── DuoSetterScreen       — 双人模式出题界面
├── ResultModal           — 过关/失败弹窗
├── TutorialOverlay       — 新手教程覆盖层
└── SettingsScreen        — 设置页面
```

---

### 五、各页面详细 UI 规格

#### 5.1 启动画面 (SplashScreen)

- 持续 2 秒，纯黑背景
- "SUPER DECODER" 文字用 Orbitron 字体，逐字符亮起（打字机效果），每个字符带绿色 LED 发光
- 下方小字 "600 LEVELS" 淡入
- 可选：扫描线动画覆盖全屏

#### 5.2 主菜单 (HomeScreen)

```
┌──────────────────────────────────────┐
│          ┌────────────────┐          │
│          │  SUPER         │          │  Orbitron 字体
│          │   DECODER      │          │  带绿色发光效果
│          └────────────────┘          │
│                                      │
│          进度: Level 42 / 600        │  进度条（细长的 LED 条）
│          ████████░░░░░░░░░░░░        │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  ▶  SOLO MODE               │   │  主按钮，最醒目
│   │     单人闯关                  │   │  带右箭头图标
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  👥 DUO MODE                │   │  次按钮
│   │     双人对决                  │   │
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │  🎲 FREE PLAY               │   │
│   │     自由模式                  │   │
│   └──────────────────────────────┘   │
│                                      │
│   ┌─────────────┐ ┌─────────────┐   │
│   │ 📊 统计     │ │ ⚙️ 设置     │   │  底部两个小按钮
│   └─────────────┘ └─────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

按钮样式：
- 深色卡片背景 (`--bg-card`)，左侧带细长的绿色竖条装饰
- Hover/Active 时整体轻微亮起 + 左侧竖条变宽
- 按钮之间间距 12px
- 每个按钮高度约 64-72px

#### 5.3 核心游戏界面 (GameScreen) — 最重要的页面

这是用户花 95% 时间的界面，必须精心打磨。

```
┌──────────────────────────────────────────┐
│ ← Back    LEVEL 042    ⚙️               │ GameHeader
│           ★★★★★★★ (7)   [EASY]          │ 剩余次数 + 模式标签
├──────────────────────────────────────────┤
│                                          │
│  ┌─ 猜测 1 ─────────────────────────┐   │ 已完成行（略暗）
│  │ [🔴] [🔵] [🟢] [🟡]  │🟢│⚪│    │   │
│  │                       │⚪│ ·│    │   │ ← 间接提示 2×2 网格
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ 猜测 2 ─────────────────────────┐   │ 已完成行
│  │ [🟠] [🔴] [🟡] [🔵]  │🟢│🟢│    │   │
│  │                       │⚪│ ·│    │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ 猜测 3 (当前) ──────────────────┐   │ 当前输入行（高亮边框）
│  │ [🔴] [__] [__] [__]  │  │  │    │   │ 闪烁光标在下一个空位
│  │                       │  │  │    │   │
│  └───────────────────────────────────┘   │
│                                          │
│  ┌─ 猜测 4 ─────────────────────────┐   │ 未使用行（最暗）
│  │ [  ] [  ] [  ] [  ]  │  │  │    │   │
│  └───────────────────────────────────┘   │
│  ... 5, 6, 7 ...                         │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  颜色选择器:                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │ 根据关卡显示 4-8 个
│  │ 🔴 │ │ 🔵 │ │ 🟢 │ │ 🟡 │            │ 圆形色块，带发光
│  └────┘ └────┘ └────┘ └────┘            │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │ 如果 > 4 色，显示第二行
│  │ 🟠 │ │ 🟣 │ │ ⬜ │ │ 🩷 │            │
│  └────┘ └────┘ └────┘ └────┘            │
│                                          │
│  ┌──────────┐        ┌──────────────┐   │
│  │  ↩ 清除   │        │ ✓ 确认猜测   │   │
│  └──────────┘        └──────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

**关键 UI 细节**：

**a) 猜测行 (GuessRow)**
- 每行包含 4 个颜色槽 + 提示区域
- 已完成行：颜色填充完毕，提示已显示，整行亮度降低 30%
- 当前行：白色/绿色边框高亮，未填充槽位有缓慢脉冲动画
- 未使用行：极暗，几乎融入背景
- 行高约 `52-60px`，行间距 `6-8px`

**b) 颜色槽 (ColorSlot)**
- 尺寸：`44px × 44px` 圆角矩形 (border-radius: 8px)
- 空状态：深色底 + 虚线边框 + 内部微弱十字标记
- 填充状态：纯色填充 + 外发光（box-shadow: 0 0 var(--glow-radius) color）
- 当前选中槽：边框变为白色，底部有小三角指示器
- 触摸时有轻微缩放反馈（scale 0.95 → 1.0）

**c) 提示区域**

**直接提示模式 (Easy)**：
- 4 个小圆点 (8px) 排列在对应颜色槽**正下方**
- 绿色 = 正确, 白色 = 错位, 灰色 = 不存在
- 提示灯亮起动画：从左到右依次亮起，间隔 200ms

**间接提示模式 (Advanced)**：
- 行右侧的 `2×2` 网格，每个点 `10px`
- 排列顺序：先绿后白，左上 → 右上 → 左下 → 右下
- 网格整体尺寸约 `28px × 28px`
- 提示灯亮起动画：顺序亮起，间隔 150ms

**d) 颜色选择器 (ColorPicker)**
- 圆形按钮，直径 `48px`
- 内部纯色填充，外圈深色描边
- 选中/按下时：外圈变亮 + 轻微放大 + 发光增强
- 已在当前行使用的颜色：标记半透明遮罩或打勾（因为不允许重复）
- 4 个颜色时排一行，5-8 个颜色时排两行 (每行 4 个)

**e) 操作按钮**
- "清除"：灰色调，左侧图标
- "确认猜测"：绿色调（--text-accent），右侧位置更醒目
- 未填满 4 个颜色时 "确认" 按钮禁用（灰色 + opacity 0.4）
- 按钮高度 `48px`，圆角 `12px`

#### 5.4 直接提示模式 vs 间接提示模式 布局对比

```
直接提示 (Easy Mode):
┌────────────────────────────────────┐
│ [🔴]  [🟢]  [🔵]  [🟣]           │  猜测颜色
│  🟢    ⚪    ⚪    ·              │  提示灯（正下方对应）
└────────────────────────────────────┘

间接提示 (Advanced Mode):
┌────────────────────────────────────┐
│ [🔴]  [🟢]  [🔵]  [🟣]  ┌──┬──┐ │  猜测颜色
│                           │🟢│⚪│ │  提示网格（右侧）
│                           ├──┼──┤ │
│                           │⚪│ ·│ │
│                           └──┴──┘ │
└────────────────────────────────────┘
```

#### 5.5 结果弹窗 (ResultModal)

**过关弹窗**：
```
┌────────────────────────────────┐
│                                │
│      ✦  CODE CRACKED!  ✦      │  标题带发光脉冲
│                                │
│       答案: 🔴 🔵 🟢 🟡        │  显示正确密码
│                                │
│       用时: 4 / 7 步           │  步数统计
│       ⭐⭐⭐                    │  3步内=3星，5步内=2星，7步=1星
│                                │
│  ┌──────────────────────────┐  │
│  │     ▶ 下一关 (NEXT)      │  │  主按钮
│  └──────────────────────────┘  │
│                                │
│  ┌────────────┐ ┌───────────┐  │
│  │ 🏠 主菜单  │ │ 🔄 重玩   │  │  辅助按钮
│  └────────────┘ └───────────┘  │
│                                │
└────────────────────────────────┘
```

**失败弹窗**：
```
┌────────────────────────────────┐
│                                │
│      ✕  CODE INTACT  ✕        │  红色标题
│                                │
│   正确答案: 🔴 🔵 🟢 🟡       │  揭示密码
│                                │
│  ┌──────────────────────────┐  │
│  │      🔄 重试 (RETRY)     │  │  主按钮
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │      ⏭ 跳过 (SKIP)      │  │  辅助按钮
│  └──────────────────────────┘  │
│                                │
└────────────────────────────────┘
```

弹窗动画：从底部滑入 + 背景模糊（backdrop-filter: blur(8px)）

#### 5.6 设置页面 (SettingsScreen)

```
┌──────────────────────────────────────┐
│ ← Back          SETTINGS            │
├──────────────────────────────────────┤
│                                      │
│  🔊 音效          ────────── [ON]    │  Toggle 开关
│  🎵 背景音乐       ────────── [OFF]   │
│  📳 振动反馈       ────────── [ON]    │
│                                      │
│  ─── 游戏设定 ─────────────────      │
│  🎨 色盲模式       ────────── [OFF]   │  开启后颜色块上叠加图案
│  🌐 语言          ────── [中文 ▼]    │  中/英/日
│                                      │
│  ─── 关于 ─────────────────────      │
│  📖 游戏规则                    →    │
│  ℹ️  关于游戏                   →    │
│  🗑  重置进度                   →    │  需要二次确认
│                                      │
└──────────────────────────────────────┘
```

#### 5.7 新手教程 (TutorialOverlay)

- 首次启动自动触发，覆盖在游戏界面上
- 分 3-4 步引导（底部气泡 + 高亮目标区域）
- 步骤：
  1. "点击颜色来选择" → 高亮颜色选择器
  2. "点击位置放入颜色" → 高亮猜测行的槽位
  3. "填满后点击确认" → 高亮确认按钮
  4. "根据提示灯来推理" → 高亮提示区域，解释绿/白/灭的含义
- 可跳过，可从设置中重新查看

---

### 六、动画规格

| 动画名 | 触发时机 | 时长 | 效果描述 |
|--------|----------|------|----------|
| `slotPulse` | 当前行空槽 | 2s loop | 边框亮度缓慢脉冲（opacity 0.3↔0.8） |
| `colorPlace` | 放置颜色到槽位 | 200ms | scale(0.8→1.05→1.0) + 发光闪烁 |
| `hintReveal` | 确认猜测后 | 200ms×4 | 4个提示灯依次亮起，每个带 fade+scale |
| `rowSlideDown` | 当前行完成 | 300ms | 下一行轻微上滑到位 |
| `victoryBurst` | 过关 | 1.5s | 所有颜色槽同时发出光波 + 提示全绿闪烁 |
| `defeatShake` | 失败 | 500ms | 游戏板轻微震动 + 红色闪烁 |
| `modalEnter` | 弹窗出现 | 400ms | 从底部滑入 + 背景渐变模糊 |
| `starEarn` | 获得星星 | 300ms×N | 星星依次旋转亮起 |
| `levelTransition` | 切换关卡 | 600ms | 数字滚动切换（类似老虎机） |

**Framer Motion 参考**：
```tsx
// 提示灯逐个亮起
{hints.map((hint, i) => (
  <motion.div
    key={i}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: i * 0.2, type: "spring", stiffness: 500 }}
    className={`hint-dot hint-${hint.status}`}
  />
))}
```

---

### 七、PWA 配置要求

```json
// manifest.json
{
  "name": "Super Decoder",
  "short_name": "Decoder",
  "description": "600-Level Code-Breaking Puzzle Game",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0A0A12",
  "theme_color": "#0A0A12",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

关键要点：
- `display: standalone` — 全屏，无浏览器地址栏
- `orientation: portrait` — 锁定竖屏
- `background_color` 与 `theme_color` 匹配深色背景
- 状态栏颜色：`<meta name="theme-color" content="#0A0A12">`
- iOS 全屏：`<meta name="apple-mobile-web-app-capable" content="yes">`
- iOS 状态栏：`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`

---

### 八、触摸交互细节

1. **颜色选择**：点击颜色选择器中的颜色 → 自动填入当前行第一个空位 → 光标移动到下一个空位
2. **修改颜色**：点击已填充的槽位 → 该槽位变为"选中"状态（白色边框） → 再点击颜色选择器替换 → 或再次点击该槽位取消选中并清空
3. **清除按钮**：清除当前行所有已填颜色，重新开始该行
4. **确认按钮**：只在 4 个位置全部填满后可用
5. **长按颜色槽**：移除该位置的颜色（可选的备用交互）
6. **禁止操作**：已完成的行不可编辑；未到达的行不可操作
7. **防误触**：确认后有 300ms 的输入冷却期
8. **触觉反馈**：支持 `navigator.vibrate()` 的设备上，放置颜色时短振动 (10ms)，确认时中振动 (30ms)，过关时长振动 (100ms)

---

### 九、色盲无障碍模式

开启色盲模式后，每个颜色块上叠加一个**白色半透明图案符号**，确保即使无法分辨颜色也能区分：

| 颜色 | 叠加符号 | 形状描述 |
|------|---------|---------|
| 红色 | ● | 实心圆 |
| 蓝色 | ■ | 实心方块 |
| 绿色 | ▲ | 三角形 |
| 黄色 | ◆ | 菱形 |
| 橙色 | ★ | 五角星 |
| 紫色 | ✚ | 十字 |
| 白色 | ○ | 空心圆 |
| 粉色 | ♥ | 爱心 |

符号用 SVG 绘制，白色描边 + 半透明填充，尺寸约为颜色块的 50%。

---

### 十、需要生成的完整文件清单

请按以下结构生成所有文件：

```
super-decoder/
├── index.html                    # 入口 HTML + PWA meta tags
├── vite.config.ts                # Vite 配置 + PWA 插件
├── tailwind.config.ts            # Tailwind 配置
├── tsconfig.json
├── package.json
├── public/
│   ├── manifest.json             # PWA 清单
│   ├── icon-192.png              # 占位（说明需要替换）
│   └── icon-512.png
├── src/
│   ├── main.tsx                  # 入口
│   ├── App.tsx                   # 顶层路由/页面切换
│   ├── index.css                 # 全局样式 + CSS Variables + 字体导入
│   │
│   ├── stores/
│   │   ├── gameStore.ts          # Zustand: 游戏状态（当前关卡、猜测历史、提示等）
│   │   ├── progressStore.ts      # Zustand + persist: 用户进度存档
│   │   └── settingsStore.ts      # Zustand + persist: 设置（音效/语言/色盲模式）
│   │
│   ├── logic/
│   │   ├── hintEngine.ts         # 直接提示 + 间接提示算法
│   │   ├── levelGenerator.ts     # 基于种子的关卡生成
│   │   ├── constants.ts          # 颜色定义、关卡参数、难度曲线
│   │   └── seededRandom.ts       # 种子随机数实现
│   │
│   ├── components/
│   │   ├── GameBoard.tsx         # 7行猜测区主面板
│   │   ├── GuessRow.tsx          # 单行：4个颜色槽 + 提示区
│   │   ├── ColorSlot.tsx         # 单个颜色槽位（空/填充/选中/禁用状态）
│   │   ├── DirectHints.tsx       # 直接提示（4个点横排在下方）
│   │   ├── IndirectHints.tsx     # 间接提示（2×2网格）
│   │   ├── ColorPicker.tsx       # 底部颜色选择面板
│   │   ├── GameHeader.tsx        # 顶部：返回、关卡号、剩余次数、模式
│   │   ├── GameActions.tsx       # 底部：清除 + 确认按钮
│   │   ├── ResultModal.tsx       # 过关/失败结果弹窗
│   │   ├── StarRating.tsx        # 星级评分组件
│   │   ├── LevelDisplay.tsx      # LED 风格数字显示（关卡号）
│   │   ├── ProgressBar.tsx       # LED 风格进度条
│   │   ├── Toggle.tsx            # 设置页 Toggle 开关
│   │   └── TutorialOverlay.tsx   # 新手教程覆盖层
│   │
│   ├── screens/
│   │   ├── SplashScreen.tsx      # 启动画面
│   │   ├── HomeScreen.tsx        # 主菜单
│   │   ├── GameScreen.tsx        # 游戏主界面（组合上述组件）
│   │   ├── DuoSetterScreen.tsx   # 双人出题界面
│   │   ├── SettingsScreen.tsx    # 设置页
│   │   └── StatsScreen.tsx       # 统计页
│   │
│   ├── hooks/
│   │   ├── useGame.ts            # 游戏逻辑 Hook（猜测、提示、过关判定）
│   │   ├── useSound.ts           # 音效播放 Hook
│   │   └── useVibrate.ts         # 触觉反馈 Hook
│   │
│   ├── utils/
│   │   └── sound.ts              # Howler 音效加载与管理
│   │
│   └── types/
│       └── game.ts               # TypeScript 类型定义
│
└── README.md                     # 项目说明
```

---

### 十一、质量要求

1. **所有代码必须可直接运行**：`npm install && npm run dev` 后即可在浏览器中打开游玩
2. **TypeScript 严格模式**：无 `any` 类型，完整的类型定义
3. **移动端优先**：首先保证 375px 宽度完美显示，然后向上适配
4. **性能要求**：60fps 动画，无卡顿；首屏加载 < 2 秒
5. **离线可玩**：PWA Service Worker 缓存所有资源
6. **语义化组件**：每个组件职责单一，props 清晰
7. **发光效果实现**：使用 `box-shadow` 多层叠加实现 LED 发光，不使用图片

```css
/* LED 发光效果参考 */
.color-slot-filled {
  box-shadow:
    0 0 4px var(--color),
    0 0 8px var(--color),
    0 0 16px color-mix(in srgb, var(--color) 40%, transparent);
}
```

---

### 十二、注意：不要做什么

- ❌ 不要使用 `Inter`, `Roboto`, `Arial` 等通用字体
- ❌ 不要使用白色或浅色背景 — 全程深色主题
- ❌ 不要使用紫色渐变白底等 "AI 风格" 设计
- ❌ 不要省略动画 — 动画是体验的核心部分
- ❌ 不要硬编码关卡数据 — 必须用种子随机数动态生成
- ❌ 不要忘记 Safe Area Insets — iPhone 刘海/底部横条
- ❌ 不要让触摸目标小于 44px
- ❌ 不要在一个组件里写超过 200 行 — 保持拆分
- ❌ 不要使用 `localStorage` 直接调用 — 统一通过 Zustand persist
