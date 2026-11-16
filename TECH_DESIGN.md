# 番茄钟计时器 技术设计（Tech Design）

## 技术栈

- 前端：React 18.3 + TypeScript 5.6 + Vite 5.4
- 样式：Tailwind CSS 3.4（经典 tailwind.config.js + postcss.config.js 配置）
- 提醒：浏览器 Notification API + Web Audio API（AudioContext oscillator，无音频文件）
- 存储：LocalStorage（设置 + 按日期统计）
- 动画：CSS transition / animation，不引入 framer-motion

## 项目结构

```
src/
  components/
    TimerRing.tsx      # SVG 环形进度 + 大字号时间
    ModeTabs.tsx       # 工作 / 短休息 / 长休息切换标签
    Controls.tsx       # 开始 / 暂停 / 重置按钮
    SettingsPanel.tsx  # 时长设置面板（弹层）
    StatsPanel.tsx     # 今日 / 本周统计 + 循环进度点
  hooks/
    usePomodoro.ts     # 计时核心逻辑（状态机）
  types/
    index.ts           # 类型定义
  utils/
    storage.ts         # 设置与统计的 LocalStorage 读写
    audio.ts           # Web Audio 提示音
    notify.ts          # 通知权限与发送
    format.ts          # MM:SS 与日期工具
  App.tsx              # 页面组装
  main.tsx
  index.css
```

## 数据模型

### TimerMode
- "work" | "shortBreak" | "longBreak"

### Settings（LocalStorage key: pomodoro-settings）
- workMinutes: number（默认 25）
- shortBreakMinutes: number（默认 5）
- longBreakMinutes: number（默认 15）
- longBreakInterval: number（默认 4，即每 4 个番茄一次长休息）

### Stats（LocalStorage key: pomodoro-stats）
- Record<string, number>：键为本地日期 YYYY-MM-DD，值为当日完成工作番茄数

## 关键技术点

1. 倒计时精度：开始时记录 endAt 时间戳，setInterval(200ms) 轮询
   `Math.ceil((endAt - now) / 1000)`，与真实时间对齐，暂停时冻结 endAt
2. 阶段状态机：work -> (shortBreak | longBreak) -> work 循环；
   completedInCycle 达到 longBreakInterval 时进入长休息
3. 提示音：AudioContext oscillator 生成三连短音（880Hz -> 660Hz -> 880Hz），
   gain 包络避免爆音；首次开始时创建并 resume AudioContext（用户手势内）
4. 通知权限：Notification.requestPermission 需在用户手势中触发，
   在"开始"按钮点击时请求；denied 时在 UI 显示中文提示
5. 本周统计：以周一为一周起点，遍历 stats 记录求和
6. document.title：effect 监听 running/remaining/mode，统一在 hook 内维护

## TypeScript 严格模式

- tsconfig 开启 strict、noUnusedLocals、noUnusedParameters
- 解析 LocalStorage JSON 时做形状校验，损坏数据回退默认值
