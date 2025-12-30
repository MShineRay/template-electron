# Electron 基础项目模板

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.1-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

这是一个功能完整的 Electron 基础项目模板，包含了常用的功能模块封装。

**仓库地址**：https://github.com/MShineRay/template-electron

## 功能特性

### 1. 窗口管理 (WindowManager)

- ✅ 创建和管理主窗口
- ✅ 窗口状态保存和恢复（位置、大小、最大化状态）
- ✅ 窗口控制（最小化、最大化、全屏、关闭）
- ✅ 窗口居中显示

### 2. 菜单栏 (MenuManager)

- ✅ 完整的应用菜单（文件、编辑、视图、窗口、帮助）
- ✅ macOS 和 Windows/Linux 平台适配
- ✅ 快捷键支持
- ✅ 文件对话框（打开、保存）

### 3. 系统托盘 (TrayManager)

- ✅ 系统托盘图标
- ✅ 托盘菜单（显示/隐藏窗口、退出）
- ✅ 点击托盘图标显示/隐藏窗口
- ✅ 跨平台支持

### 4. IPC 通信 (IpcManager)

- ✅ 安全的 IPC 通信封装
- ✅ 窗口控制 API
- ✅ 配置管理 API
- ✅ 应用信息 API
- ✅ Context Isolation 和 Preload 脚本

### 5. 配置管理 (ConfigManager)

- ✅ 基于 electron-store 的持久化配置
- ✅ 配置的读取、设置、删除
- ✅ 配置重置功能
- ✅ 默认配置支持

### 6. 日志记录 (Logger)

- ✅ 基于 electron-log 的日志系统
- ✅ 文件日志（自动轮转，最大 5MB）
- ✅ 控制台日志输出
- ✅ 多级别日志（info、error、warn、debug）

## 项目结构

```
template-electron/
├── src/
│   ├── main/                    # 主进程代码
│   │   ├── main.ts             # 主进程入口
│   │   ├── preload.ts          # Preload 脚本
│   │   └── modules/             # 功能模块
│   │       ├── window-manager.ts    # 窗口管理
│   │       ├── menu-manager.ts      # 菜单管理
│   │       ├── tray-manager.ts      # 系统托盘
│   │       ├── ipc-manager.ts       # IPC 通信
│   │       ├── config-manager.ts    # 配置管理
│   │       └── logger.ts            # 日志记录
│   └── renderer/                # 渲染进程代码
│       ├── index.html          # 主页面
│       └── main.ts             # 渲染进程入口
├── dist/                        # 编译输出目录
├── doc/                         # 项目文档
│   ├── README.md               # 文档索引
│   ├── development.md          # 开发指南
│   ├── api.md                  # API 文档
│   ├── architecture.md         # 架构设计
│   └── deployment.md           # 部署指南
├── test/                        # 测试文件
│   ├── README.md               # 测试文档
│   ├── unit/                   # 单元测试
│   │   ├── main/              # 主进程测试
│   │   └── renderer/          # 渲染进程测试
│   ├── integration/           # 集成测试
│   └── e2e/                   # 端到端测试
├── package.json
├── tsconfig.json
├── tsconfig.main.json
├── vite.config.ts
├── .env.example          # 环境变量示例文件
├── .env.development      # 开发环境配置
├── .env.production       # 生产环境配置
└── README.md
```

## 快速开始

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 启动开发

```bash
pnpm run dev
```

### 构建和打包

```bash
# 生产环境打包（当前平台）
pnpm run dist:prod

# 开发环境打包
pnpm run dist:dev

# 跨平台打包
pnpm run dist:mac:prod      # macOS
pnpm run dist:win:prod      # Windows（需要 Wine）
pnpm run dist:linux:prod    # Linux

# 一键打包所有平台（推荐）
pnpm run dist:all:dev       # 开发环境：同时打包 macOS、Windows、Linux
pnpm run dist:all:prod      # 生产环境：同时打包 macOS、Windows、Linux

# 不同环境打包（自动管理版本号）
pnpm run dist:dev           # 开发环境（版本：1.0.0-dev.20251230120000）
pnpm run dist:test          # 测试环境（版本：1.0.0-beta.1）
pnpm run dist:prod          # 生产环境（版本：1.0.0）
```

> 💡 **提示**：
>
> - 在 Mac 上可以打包 Windows 和 Linux 安装包，Windows 需要安装 Wine。查看 [部署指南](./doc/deployment.md#跨平台打包) 了解详情。
> - 不同环境会自动生成不同的版本号。查看 [版本号管理策略](./doc/version-management.md) 了解详情。

> 📖 **详细文档**：查看 [开发指南](./doc/development.md) 了解完整的开发流程和配置说明。

## 更多信息

- 📖 [完整文档](./doc/README.md) - 查看所有文档
- 🚀 [开发指南](./doc/development.md) - 开发环境搭建和开发流程
- 🏗️ [架构设计](./doc/architecture.md) - 项目架构和模块说明
- 📦 [部署指南](./doc/deployment.md) - 应用打包和部署
- 📦 [打包文件说明](./doc/packages.md) - 如何识别不同平台的安装包
- 📊 [项目分析](./doc/project-analysis.md) - 项目设计合理性、冗余、错误和缺失功能分析

## 使用说明

### API 使用

查看 [API 文档](./doc/api.md) 了解完整的 API 使用说明。

### 模块使用

查看 [架构设计](./doc/architecture.md) 了解如何在主进程中使用各个模块。

## 扩展功能

项目已包含以下扩展功能：

- ✅ **HTTP 客户端** - 支持拦截器和错误处理，查看 [HTTP 客户端文档](./doc/http-client.md)
- ✅ **环境变量配置** - 支持多环境配置，查看 [环境变量配置文档](./doc/environment.md)

根据项目需求，你还可以考虑添加：

- 自动更新（使用 `electron-updater`）
- 文件操作（文件读写、文件监听等）
- 系统通知（使用系统原生通知）
- 全局快捷键注册
- 主题切换（深色/浅色主题）
- 多语言（i18n 国际化）
- 数据库（SQLite 或其他数据库）

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Vitest** - 快速、现代的测试框架
- **pnpm** - 快速、节省磁盘空间的包管理器（推荐）
- **electron-log** - 日志记录
- **electron-store** - 配置持久化

## 包管理器

项目默认配置为使用 **pnpm**，具有以下优势：

- 🚀 更快的安装速度
- 💾 节省磁盘空间（使用硬链接和符号链接）
- 🔒 更严格的依赖管理
- 📦 更好的 monorepo 支持

如果你还没有安装 pnpm，可以通过以下方式安装：

```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 Homebrew (macOS)
brew install pnpm

# 或使用 curl
curl -fsSL https://get.pnpm.io/install.sh | sh -

# 或使用 Corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

项目也支持使用 npm，但建议使用 pnpm 以获得更好的性能和磁盘空间利用率。

## 许可证

MIT
