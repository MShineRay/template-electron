# 架构设计

本文档介绍项目的架构设计和模块说明。

## 整体架构

项目采用 Electron 主进程 + 渲染进程的架构：

```
┌─────────────────────────────────────┐
│         Electron 主进程               │
│  ┌───────────────────────────────┐  │
│  │   Application (main.ts)       │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   WindowManager                │  │
│  │   MenuManager                  │  │
│  │   TrayManager                  │  │
│  │   IpcManager                   │  │
│  │   ConfigManager                │  │
│  │   Logger                       │  │
│  └───────────────────────────────┘  │
└───────────┬─────────────────────────┘
            │ IPC (Context Bridge)
┌───────────▼─────────────────────────┐
│        渲染进程 (Chromium)           │
│  ┌───────────────────────────────┐  │
│  │   HTML/CSS/JavaScript         │  │
│  │   window.electronAPI          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## 模块说明

### 主进程模块

#### Application (main.ts)
应用主入口，负责初始化各个模块和管理应用生命周期。

#### WindowManager
- 职责：窗口的创建、管理和状态保存
- 功能：
  - 创建主窗口
  - 窗口状态管理（位置、大小、最大化状态）
  - 窗口控制（最小化、最大化、全屏、关闭）

#### MenuManager
- 职责：应用菜单栏的管理
- 功能：
  - 创建应用菜单
  - 平台适配（macOS/Windows/Linux）
  - 快捷键支持

#### TrayManager
- 职责：系统托盘的管理
- 功能：
  - 创建托盘图标
  - 托盘菜单
  - 窗口显示/隐藏控制

#### IpcManager
- 职责：IPC 通信的管理
- 功能：
  - 注册 IPC 处理器
  - 提供安全的 API 接口
  - 类型安全的通信

#### ConfigManager
- 职责：应用配置的持久化存储
- 功能：
  - 配置的读取和写入
  - 默认配置管理
  - 配置重置

#### Logger
- 职责：日志记录
- 功能：
  - 多级别日志（info、error、warn、debug）
  - 文件日志（自动轮转）
  - 控制台日志输出

### 渲染进程

#### index.html
应用的主页面，包含 UI 结构。

#### main.ts
渲染进程的入口文件，负责：
- 初始化 UI
- 调用 Electron API
- 处理用户交互

### Preload 脚本

#### preload.ts
在渲染进程和主进程之间建立安全的通信桥梁：
- 使用 Context Bridge 暴露安全的 API
- 提供类型定义
- 隔离主进程和渲染进程

## 数据流

### 配置管理流程

```
渲染进程 → window.electronAPI.config.set()
    ↓
IPC 通信
    ↓
主进程 IpcManager → ConfigManager.set()
    ↓
electron-store (持久化)
```

### 窗口控制流程

```
渲染进程 → window.electronAPI.window.minimize()
    ↓
IPC 通信
    ↓
主进程 IpcManager → WindowManager.minimizeMainWindow()
    ↓
BrowserWindow.minimize()
```

## 安全设计

1. **Context Isolation**：启用上下文隔离，防止渲染进程直接访问 Node.js API
2. **Sandbox**：可选的沙箱模式（当前未启用，可根据需要启用）
3. **Preload 脚本**：通过 Preload 脚本安全地暴露必要的 API
4. **类型安全**：使用 TypeScript 确保类型安全

## 扩展建议

### 添加新功能模块

1. 在 `src/main/modules/` 下创建新模块
2. 在 `Application` 类中初始化模块
3. 如需 IPC 通信，在 `IpcManager` 中注册处理器
4. 在 `preload.ts` 中暴露 API（如需要）

### 添加新的渲染页面

1. 在 `src/renderer/` 下创建新的 HTML/TS 文件
2. 在 Vite 配置中添加路由（如需要）
3. 在主进程中创建新窗口并加载页面

