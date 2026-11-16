# 番茄钟计时器 AI 开发指令（AGENTS.md）

## 项目概述

使用 React + TypeScript + Tailwind CSS 开发的番茄工作法计时器，含通知、提示音与本地统计。

## 开发环境

- 操作系统：Windows
- 终端：PowerShell / Git Bash
- 请使用 Windows 兼容的命令

## 开发规范

- 使用 TypeScript 严格模式，禁止 any
- 组件使用函数式组件 + Hooks
- 计时核心逻辑集中在 hooks/usePomodoro.ts，组件只负责展示与交互
- LocalStorage 读写全部封装在 utils/storage.ts，组件不直接操作 localStorage
- 常量使用 UPPER_SNAKE_CASE，组件名 PascalCase，函数名 camelCase

## 设计要求

- 深蓝灰背景卡片式布局；工作红色 / 短休息绿色 / 长休息蓝色三种强调色
- 环形进度用 SVG 圆环实现，禁止引入图表或动画库
- 提示音用 Web Audio API 合成，禁止依赖音频文件
- 界面文案全部使用中文

## 注意事项

- 倒计时必须基于时间戳计算，避免 setInterval 累计误差
- Notification 权限请求必须发生在用户手势中（开始按钮点击）
- 通知权限被拒绝或不支持时，UI 给中文提示，不抛错
- LocalStorage 数据解析失败时回退默认值，不允许白屏
- 不留 TODO / 占位符；代码与配置文件一律 ASCII 直引号
