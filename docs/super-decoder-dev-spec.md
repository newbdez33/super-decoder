# Super Decoder — 手机游戏开发规格书

## 1. 游戏概述

### 1.1 原版产品
Super Decoder 是一款手持式解密益智游戏机，基于经典的 **Mastermind（珠机妙算）** 桌游玩法。玩家需要在 **7 步以内** 破解一个由 **4 个颜色** 组成的密码。游戏共有 **600 关**，分为简单模式（100关）和进阶模式（500关），支持单人和双人模式。

### 1.2 开发目标
开发一款还原 Super Decoder 玩法和界面风格的手机游戏（React Native 或纯 Web App），保持原版的 LED 像素复古美感。

---

## 2. 核心玩法规则

### 2.1 基本规则
- **密码组成**：4 个位置，每个位置有一个颜色
- **密码中每个颜色不重复**（4个不同颜色）
- **可选颜色池**：根据难度不同，可供选择的颜色数量递增（简单关卡 4-5 种颜色，困难关卡最多 8 种颜色）
- **猜测次数**：最多 **7 次** 机会
- **目标**：在 7 次猜测内，猜出正确的 4 色组合及其位置

### 2.2 颜色系统
原版设备使用 LED 灯显示颜色，共 **8 种颜色**可用（随难度递增逐步引入更多颜色）：

| 编号 | 颜色 | 十六进制参考值 | 说明 |
|------|------|---------------|------|
| 1 | 🔴 红色 | `#FF0000` | Red |
| 2 | 🔵 蓝色 | `#0066FF` | Blue |
| 3 | 🟢 绿色 | `#00CC00` | Green |
| 4 | 🟡 黄色 | `#FFDD00` | Yellow |
| 5 | 🟠 橙色 | `#FF8800` | Orange |
| 6 | 🟣 紫色 | `#CC00FF` | Purple |
| 7 | ⬜ 白色 | `#FFFFFF` | White |
| 8 | 🩷 粉色 | `#FF66CC` | Pink |

> **注意**：具体颜色值可根据 UI 设计微调，关键是要在深色背景上形成鲜明的 LED 发光效果。

### 2.3 难度递进机制
- **简单模式（Level 1-100）**：使用 **直接提示（Direct Hints）**，可选颜色从 4 种逐步增加到 6 种
- **进阶模式（Level 101-600）**：使用 **间接提示（Indirect Hints）**，可选颜色从 5 种逐步增加到 8 种
- 关卡越高，可选颜色越多，组合可能性越大，难度越高

### 2.4 难度参考公式
- 4 种颜色选 4 个（不重复）= 4! = 24 种排列
- 5 种颜色选 4 个（不重复）= 5×4×3×2 = 120 种排列
- 6 种颜色选 4 个 = 360 种排列
- 7 种颜色选 4 个 = 840 种排列
- 8 种颜色选 4 个 = 8×7×6×5 = 1,680 种排列

---

## 3. 提示系统（核心机制）

### 3.1 直接提示（Direct Hints）— 简单模式

每次猜测后，在**每个位置的正下方**直接显示该位置的反馈：

| 提示颜色 | 含义 |
|----------|------|
| 🟢 绿色灯 | 该位置的颜色**完全正确**（颜色对、位置也对） |
| ⚪ 白色灯 | 该颜色**存在于密码中，但位置不对** |
| ❌ 无灯/灭灯 | 该颜色**不存在于密码中** |

**示例**：
```
密码:     [红] [蓝] [绿] [黄]
猜测:     [红] [绿] [蓝] [紫]
直接提示: [🟢] [⚪] [⚪] [❌]
           ↑正确  ↑色对位错 ↑色对位错 ↑不存在
```

**关键特征**：每个提示灯直接对应上方的猜测位置，玩家可以立刻知道每个颜色的状态。

### 3.2 间接提示（Indirect Hints）— 进阶模式

每次猜测后，提示信息**不与位置对应**，而是在行的右侧显示汇总反馈（类似经典 Mastermind）：

| 提示 | 含义 |
|------|------|
| 🟢 绿色点 | 密码中有 N 个颜色**位置完全正确** |
| ⚪ 白色点 | 密码中有 N 个颜色**存在但位置不对** |
| 无显示 | 剩余的猜测颜色**不存在于密码中** |

提示点排列在一个 **2×2 的小方格区域**内（最多 4 个点），不表明具体哪个位置对应哪个提示。

**示例**：
```
密码:     [红] [蓝] [绿] [黄]
猜测:     [红] [绿] [紫] [蓝]
间接提示: 🟢 ⚪    （右侧显示，2×2网格中）
          ⚪ ·
含义: 1个位置完全正确(红)，2个颜色对但位置错(绿、蓝)，1个不存在(紫)
```

**关键特征**：玩家需要自行推理哪些颜色是对的、哪些位置需要调整，难度显著高于直接提示。

---

## 4. 游戏模式

### 4.1 单人模式（Solo Mode）
- 系统预设密码，共 600 关
- 关卡按编号顺序推进，保存进度
- 简单模式（关卡 1-100）：直接提示
- 进阶模式（关卡 101-600）：间接提示
- 过关条件：在 7 次猜测内破解密码
- 失败后可重试当前关卡

### 4.2 双人模式（Duo Mode）
- **出题者（Code Setter）**：手动设置一个 4 色密码
- **解题者（Code Breaker）**：在 7 次机会内破解
- 可设置**计时限制**
- 可选择直接提示或间接提示模式
- 两人交替出题/解题

### 4.3 自由模式（建议新增）
- 随机生成密码，无关卡限制
- 可自选颜色数量（4-8种）
- 可自选提示模式（直接/间接）
- 用于练习和娱乐

---

## 5. UI 界面设计规格

### 5.1 整体风格
- **深色背景**（黑色/深灰），模拟原版实体设备的暗色面板
- **LED 发光效果**：颜色块带有光晕/发光效果，模拟 LED 灯珠
- **复古科技感**：莫尔斯电码音效、像素化字体、扫描线纹理
- **紧凑布局**：模拟手持设备的精巧感

### 5.2 主游戏界面布局

```
┌─────────────────────────────────┐
│  ┌─────┐        SUPER DECODER   │
│  │LEVEL│        ★ ★ ★ ★ ★ ★ ★  │  ← 7次机会指示器（星星/灯泡）
│  │ 042 │        [Easy/Advanced]  │
│  └─────┘                        │
├─────────────────────────────────┤
│                                 │
│  猜测 1: [🔴][🔵][🟢][🟡] [提示] │  ← 已完成的猜测行
│  猜测 2: [🟠][🔴][🟡][🔵] [提示] │
│  猜测 3: [__][__][__][__] [    ] │  ← 当前输入行
│  猜测 4: [  ][  ][  ][  ] [    ] │  ← 未使用的行
│  猜测 5: [  ][  ][  ][  ] [    ] │
│  猜测 6: [  ][  ][  ][  ] [    ] │
│  猜测 7: [  ][  ][  ][  ] [    ] │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐           │  ← 颜色选择器
│  │🔴│ │🔵│ │🟢│ │🟡│           │    （根据关卡显示可用颜色）
│  └──┘ └──┘ └──┘ └──┘           │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐           │
│  │🟠│ │🟣│ │⬜│ │🩷│           │
│  └──┘ └──┘ └──┘ └──┘           │
│                                 │
│     [  确认猜测 / SUBMIT  ]      │
│                                 │
└─────────────────────────────────┘
```

### 5.3 提示区域设计

**直接提示模式（Easy Mode）**：
```
猜测行: [🔴] [🟢] [🔵] [🟣]
提示行: [🟢] [⚪] [⚪] [  ]
         ↑     ↑     ↑    ↑
        正确  色对  色对  不存在
```
提示灯直接出现在每个颜色块下方，一一对应。

**间接提示模式（Advanced Mode）**：
```
猜测行: [🔴] [🟢] [🔵] [🟣]  ┌──┬──┐
                               │🟢│⚪│  ← 2×2 提示网格
                               ├──┼──┤
                               │⚪│  │
                               └──┴──┘
```
提示集中在行右侧的 2×2 小网格中：
- 绿点表示"有N个完全正确"
- 白点表示"有N个颜色对但位置错"
- 空位表示"颜色不存在"
- **顺序是: 绿点优先排列，然后白点，最后空位**（不对应具体位置）

### 5.4 交互方式

| 操作 | 原版设备 | 手机版 |
|------|----------|--------|
| 选择颜色 | 旋转旋钮 | 点击颜色选择器 |
| 切换位置 | 短按旋钮 | 点击目标位置槽 |
| 确认猜测 | 长按旋钮 | 点击"确认"按钮 |
| 切换模式 | 侧面滑块 | 设置页面切换 |
| 静音 | 长按旋钮开机 | 设置页面开关 |

**拖拽操作（推荐）**：也可支持从颜色选择器**拖拽**颜色到目标位置槽。

### 5.5 动画与音效

| 事件 | 视觉效果 | 音效 |
|------|----------|------|
| 选中颜色 | 颜色块亮起 + 轻微放大 | 短促"滴"声 |
| 确认猜测 | 提示灯依次亮起动画 | 莫尔斯电码风格连续"滴滴"声 |
| 猜对（过关）| 全部绿灯闪烁 + 胜利动画 | 胜利音效（上升音调） |
| 猜错（用尽机会）| 显示正确答案 + 红色闪烁 | 失败音效 |
| 关卡切换 | 数字滚动切换动画 | 短促切换音 |

---

## 6. 数据模型

### 6.1 关卡数据结构

```typescript
interface Level {
  id: number;              // 1-600
  mode: 'easy' | 'advanced'; // 1-100 = easy, 101-600 = advanced
  hintType: 'direct' | 'indirect';
  availableColors: number;  // 可选颜色数量 (4-8)
  secretCode: Color[];     // 长度为 4 的密码，预生成或根据种子动态生成
}

type Color = 'red' | 'blue' | 'green' | 'yellow' | 'orange' | 'purple' | 'white' | 'pink';

interface GameState {
  currentLevel: number;
  guesses: Guess[];        // 最多 7 条
  maxGuesses: 7;
  isComplete: boolean;
  isWon: boolean;
}

interface Guess {
  colors: Color[];          // 玩家猜测的 4 个颜色
  hints: DirectHint[] | IndirectHint;
}

// 直接提示 - 每个位置一个反馈
interface DirectHint {
  position: number;         // 0-3
  status: 'correct' | 'wrong_position' | 'not_exist';
}

// 间接提示 - 汇总反馈
interface IndirectHint {
  correctPosition: number;  // 颜色和位置都对的数量 (绿点)
  correctColor: number;     // 颜色对但位置错的数量 (白点)
  // 不存在的数量 = 4 - correctPosition - correctColor
}
```

### 6.2 用户存档数据

```typescript
interface UserProgress {
  easyProgress: number;      // 已完成的简单模式关卡数
  advancedProgress: number;  // 已完成的进阶模式关卡数
  currentLevel: number;      // 当前关卡
  levelStates: Map<number, LevelState>;
  statistics: Statistics;
}

interface LevelState {
  attempts: number;     // 用了几次猜测通关
  completed: boolean;
  bestAttempts: number; // 最佳成绩
}

interface Statistics {
  totalPlayed: number;
  totalWon: number;
  currentStreak: number;
  bestStreak: number;
  averageAttempts: number;
}
```

---

## 7. 提示判定算法

### 7.1 直接提示算法（Easy Mode）

```typescript
function getDirectHints(secret: Color[], guess: Color[]): DirectHint[] {
  return guess.map((color, i) => {
    if (color === secret[i]) {
      return { position: i, status: 'correct' };
    } else if (secret.includes(color)) {
      return { position: i, status: 'wrong_position' };
    } else {
      return { position: i, status: 'not_exist' };
    }
  });
}
```

### 7.2 间接提示算法（Advanced Mode / Mastermind 标准算法）

```typescript
function getIndirectHints(secret: Color[], guess: Color[]): IndirectHint {
  let correctPosition = 0;
  let correctColor = 0;
  
  const secretRemaining: (Color | null)[] = [...secret];
  const guessRemaining: (Color | null)[] = [...guess];
  
  // 第一轮: 检查完全匹配（位置和颜色都对）
  for (let i = 0; i < 4; i++) {
    if (guess[i] === secret[i]) {
      correctPosition++;
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }
  
  // 第二轮: 检查颜色对但位置错
  for (let i = 0; i < 4; i++) {
    if (guessRemaining[i] === null) continue;
    const matchIndex = secretRemaining.findIndex(
      (c, j) => c !== null && c === guessRemaining[i]
    );
    if (matchIndex !== -1) {
      correctColor++;
      secretRemaining[matchIndex] = null;
    }
  }
  
  return { correctPosition, correctColor };
}
```

> **重要**：间接提示算法必须使用两轮匹配。第一轮先匹配精确位置，第二轮再匹配错位颜色，避免重复计数。这是 Mastermind 的标准算法。

---

## 8. 关卡生成策略

### 8.1 预生成 vs 动态生成

**推荐方案**：使用**种子随机数（seeded RNG）**，确保每个关卡号对应固定密码，所有玩家体验一致。

```typescript
function generateLevel(levelId: number): Level {
  const rng = seedRandom(levelId); // 基于关卡ID的确定性随机
  
  let mode: 'easy' | 'advanced';
  let numColors: number;
  
  if (levelId <= 100) {
    mode = 'easy';
    // 简单模式: 前30关用4色, 31-60用5色, 61-100用6色
    if (levelId <= 30) numColors = 4;
    else if (levelId <= 60) numColors = 5;
    else numColors = 6;
  } else {
    mode = 'advanced';
    // 进阶模式: 逐步增加颜色数
    if (levelId <= 200) numColors = 5;
    else if (levelId <= 350) numColors = 6;
    else if (levelId <= 500) numColors = 7;
    else numColors = 8;
  }
  
  const allColors: Color[] = ['red','blue','green','yellow','orange','purple','white','pink'];
  const availableColors = allColors.slice(0, numColors);
  
  // 从可用颜色中随机选4个不重复颜色作为密码
  const shuffled = shuffle(availableColors, rng);
  const secretCode = shuffled.slice(0, 4);
  
  return {
    id: levelId,
    mode,
    hintType: mode === 'easy' ? 'direct' : 'indirect',
    availableColors: numColors,
    secretCode
  };
}
```

### 8.2 难度曲线建议

| 关卡范围 | 模式 | 可选颜色数 | 排列数 | 估计难度 |
|----------|------|-----------|--------|----------|
| 1-30 | 简单+直接提示 | 4 | 24 | ⭐ |
| 31-60 | 简单+直接提示 | 5 | 120 | ⭐⭐ |
| 61-100 | 简单+直接提示 | 6 | 360 | ⭐⭐⭐ |
| 101-200 | 进阶+间接提示 | 5 | 120 | ⭐⭐⭐ |
| 201-350 | 进阶+间接提示 | 6 | 360 | ⭐⭐⭐⭐ |
| 351-500 | 进阶+间接提示 | 7 | 840 | ⭐⭐⭐⭐⭐ |
| 501-600 | 进阶+间接提示 | 8 | 1,680 | ⭐⭐⭐⭐⭐⭐ |

---

## 9. 双人模式详细规格

### 9.1 流程

```
1. 选择"双人模式"
2. 选择提示类型（直接/间接）
3. 出题者设置密码:
   - 从颜色选择器中选择 4 个不同颜色放入 4 个位置
   - 设置计时器时间（可选: 30秒/1分钟/2分钟/3分钟/5分钟/无限制）
4. 确认密码后，屏幕切换到解题界面（传给对方）
5. 解题者开始猜测（规则同单人模式）
6. 成功或失败后显示结果
7. 交换角色
```

### 9.2 出题界面

```
┌──────────────────────────────┐
│      CODE SETTER             │
│                              │
│  设置你的密码:                │
│  [ _ ] [ _ ] [ _ ] [ _ ]    │
│                              │
│  可用颜色:                    │
│  🔴 🔵 🟢 🟡 🟠 🟣 ⬜ 🩷     │
│                              │
│  计时设置: [▼ 1分钟]         │
│                              │
│     [ 确认密码 ]              │
│                              │
│  ⚠️ 设置完成后请将手机交给对方  │
└──────────────────────────────┘
```

---

## 10. 技术架构建议

### 10.1 推荐技术栈

| 层级 | 推荐方案 | 备注 |
|------|----------|------|
| 框架 | React Native / Expo | 跨平台 iOS + Android |
| 替代方案 | React + PWA | 纯 Web，无需应用商店 |
| 状态管理 | Zustand 或 React Context | 轻量级游戏足够 |
| 持久化 | AsyncStorage / localStorage | 存档进度 |
| 动画 | React Native Reanimated / CSS Animation | LED 发光效果 |
| 音效 | expo-av / Howler.js | 莫尔斯电码音效 |
| 随机数 | seedrandom 库 | 确保关卡一致性 |

### 10.2 项目结构（参考）

```
src/
├── components/
│   ├── GameBoard.tsx        # 主游戏面板（7行猜测区域）
│   ├── GuessRow.tsx         # 单行猜测显示
│   ├── ColorSlot.tsx        # 单个颜色槽位
│   ├── HintDisplay.tsx      # 提示显示（直接/间接两种模式）
│   ├── DirectHints.tsx      # 直接提示组件
│   ├── IndirectHints.tsx    # 间接提示组件（2×2网格）
│   ├── ColorPicker.tsx      # 颜色选择器
│   ├── LevelIndicator.tsx   # 关卡编号显示
│   └── AttemptsIndicator.tsx # 剩余次数指示器
├── screens/
│   ├── HomeScreen.tsx       # 主菜单
│   ├── GameScreen.tsx       # 游戏界面
│   ├── DuoSetupScreen.tsx   # 双人模式设置
│   ├── DuoSetterScreen.tsx  # 出题界面
│   ├── SettingsScreen.tsx   # 设置页面
│   └── StatsScreen.tsx      # 统计页面
├── logic/
│   ├── hintEngine.ts        # 提示判定算法
│   ├── levelGenerator.ts    # 关卡生成器
│   ├── gameState.ts         # 游戏状态管理
│   └── constants.ts         # 颜色定义、配置常量
├── utils/
│   ├── seededRandom.ts      # 种子随机数
│   ├── storage.ts           # 持久化存储
│   └── sound.ts             # 音效管理
├── styles/
│   └── theme.ts             # LED 风格主题定义
└── App.tsx
```

### 10.3 关键样式常量

```typescript
export const THEME = {
  background: '#1A1A2E',       // 深色背景
  boardBackground: '#16213E',  // 游戏板背景
  slotEmpty: '#0F3460',        // 空槽位
  slotBorder: '#533483',       // 槽位边框
  textColor: '#E0E0E0',       // 文字颜色
  accentColor: '#00FF88',      // 强调色（成功绿）
  
  colors: {
    red:    '#FF2D2D',
    blue:   '#2D7CFF',
    green:  '#2DFF5E',
    yellow: '#FFE52D',
    orange: '#FF8C2D',
    purple: '#C42DFF',
    white:  '#F0F0F0',
    pink:   '#FF6EB4',
  },
  
  hints: {
    correct:       '#00FF00',  // 绿灯 - 完全正确
    wrongPosition: '#FFFFFF',  // 白灯 - 颜色对位置错
    notExist:      '#333333',  // 灭灯 - 不存在
  },
  
  // LED 发光效果
  glowRadius: 8,
  glowOpacity: 0.6,
};
```

---

## 11. 胜败判定与流程

```
开始关卡
  ↓
显示可用颜色和空白猜测行
  ↓
玩家选择4个颜色放入当前行 → 点击确认
  ↓
系统计算提示（直接或间接）
  ↓
┌─ 4个绿点（全部正确）? → 🎉 过关！→ 解锁下一关
│
├─ 已用完7次猜测? → ❌ 失败 → 显示正确答案 → 提供"重试"
│
└─ 否 → 进入下一行猜测
```

---

## 12. 额外功能建议

### 12.1 原版已有功能
- ✅ 进度保存（关卡编号记忆）
- ✅ 静音模式
- ✅ Easy / Advanced 模式切换
- ✅ 双人模式（出题+计时）

### 12.2 建议增加的功能
- 📊 统计面板：胜率、平均尝试次数、连胜记录
- 🏆 成就系统：如"一次过关"、"连续通关10关"等
- 💡 新手教程：交互式引导关卡，教会提示的含义
- ↩️ 撤销功能：取消当前未提交的颜色选择
- 📱 横竖屏适配：默认竖屏
- 🌐 多语言支持：中文、英文、日文
- 🎨 主题切换：经典LED风格、现代扁平风格
- ♿ 色盲模式：在颜色块上叠加图案/符号以区分

---

## 13. 注意事项与约束

1. **密码不重复颜色**：原版每个密码中 4 个颜色互不相同（这与部分 Mastermind 版本允许重复颜色不同）
2. **直接提示的"颜色存在但位置错"判定**：在直接提示模式下，如果猜测颜色存在于密码中但不在当前位置，显示白灯。这个判定比间接提示简单，因为直接告诉了每个位置的状态。
3. **间接提示必须用两轮算法**：先匹配精确位，再匹配错位色，防止一个颜色被重复计数。
4. **关卡一致性**：同一关卡编号在不同设备上应产生相同密码（使用种子随机数）。
5. **UI 响应**：提示灯应有逐个亮起的动画效果（约 0.3 秒间隔），模拟原版 LED 逐步点亮体验。
6. **过关动画**：成功时全部提示灯闪绿色 + 胜利音效，模拟原版设备行为。
7. **不可查看答案**：原版 Solo 模式不允许查看正确答案（失败后除外）。

---

## 14. 参考资源

- [Mastermind (Wikipedia)](https://en.wikipedia.org/wiki/Mastermind_(board_game)) — 经典 Mastermind 规则参考
