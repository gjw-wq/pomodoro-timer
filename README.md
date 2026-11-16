# 专注番茄钟 🍅

基于番茄工作法的网页计时器：工作与休息自动循环、环形进度、系统通知与提示音、可自定义时长、本地统计今日/本周完成数。

## 功能清单

- 三种模式自动循环：工作（默认 25 分钟）→ 短休息（5 分钟），每 4 个番茄进入长休息（15 分钟）
- 开始 / 暂停 / 重置，倒计时基于时间戳计算，无累计误差
- MM:SS 大字号显示 + SVG 环形进度（三种模式不同强调色）
- 计时中更新 `document.title`，切到其他标签页也能看到剩余时间
- 倒计时结束：浏览器 Notification 系统通知（点击"开始"时请求权限；拒绝后界面给中文提示）
- 提示音：Web Audio API（AudioContext oscillator）实时合成，无需任何音频文件
- 工作与休息自动切换，并在页面给出文字提示
- 设置面板：自定义工作 / 短休息 / 长休息时长与长休息间隔，LocalStorage 持久化
- 统计：今日完成番茄数、本周完成番茄数（周一为一周起点）与本轮循环进度点，按日期存 LocalStorage

## 目录结构

```
├── RESEARCH.md            # 需求研究
├── PRD.md                 # 产品需求文档
├── TECH_DESIGN.md         # 技术设计文档
├── AGENTS.md              # AI 开发指令
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts        # 类型与模式元数据
    ├── utils/
    │   ├── format.ts       # MM:SS 与日期工具
    │   ├── storage.ts      # 设置 / 统计 LocalStorage 读写
    │   ├── audio.ts        # Web Audio 提示音
    │   └── notify.ts       # 通知权限与发送
    ├── hooks/
    │   └── usePomodoro.ts  # 计时核心状态机
    └── components/
        ├── TimerRing.tsx
        ├── ModeTabs.tsx
        ├── Controls.tsx
        ├── SettingsPanel.tsx
        └── StatsPanel.tsx
```

## 启动步骤

```bash
npm install
npm run dev
```

打开终端提示的地址（默认 http://localhost:5173）即可使用。

## 环境变量说明

本项目纯前端运行，数据存浏览器 LocalStorage，无需配置环境变量。

## 使用说明

- 首次点击"开始"会请求通知权限，建议允许，以便番茄结束时收到系统提醒
- 若拒绝授权，计时结束时仍会播放提示音，且页面会提示如何重新开启通知
- 修改设置后：空闲状态立即生效；计时中保存的设置将在下一阶段生效
