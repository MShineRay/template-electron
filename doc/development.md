# 开发指南

本文档介绍如何搭建开发环境并开始开发。

## 环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0（推荐）或 npm >= 8.0.0
- Git

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd template-electron
```

### 2. 安装依赖

```bash
pnpm install
# 或
npm install
```

### 3. 启动开发模式

```bash
pnpm run dev
# 或
npm run dev
```

## 开发流程

### 项目结构

```
template-electron/
├── src/
│   ├── main/              # 主进程代码
│   │   ├── main.ts       # 应用入口
│   │   ├── preload.ts    # Preload 脚本
│   │   └── modules/      # 功能模块
│   └── renderer/         # 渲染进程代码
│       ├── index.html    # 主页面
│       └── main.ts       # 渲染进程入口
├── dist/                 # 编译输出
└── doc/                  # 项目文档
```

### 代码规范

项目使用以下工具来保证代码质量：

- **TypeScript**：类型安全的 JavaScript 超集
- **ESLint**：代码质量检查工具
- **Prettier**：代码格式化工具
- **EditorConfig**：编辑器配置统一

#### 运行代码检查

```bash
# 检查代码问题
pnpm run lint

# 自动修复可修复的问题
pnpm run lint:fix
```

#### 格式化代码

```bash
# 格式化所有代码
pnpm run format

# 检查代码格式（不修改文件）
pnpm run format:check
```

#### 编辑器集成

**VS Code** 推荐安装以下插件：

- ESLint
- Prettier - Code formatter
- EditorConfig for VS Code

安装后，保存文件时会自动格式化和检查代码。

**其他编辑器**：

- 项目已配置 `.editorconfig`，支持 EditorConfig 的编辑器会自动应用配置
- 可以配置保存时运行 Prettier 格式化

### 热重载

项目已配置热重载功能：

- **渲染进程**：修改 `src/renderer/` 下的文件会自动更新
- **主进程**：修改 `src/main/` 下的文件会自动重启应用

### 调试

- 开发模式下会自动打开 DevTools
- 主进程日志会输出到控制台
- 渲染进程可以使用浏览器 DevTools 调试

## 常见问题

### Electron 安装失败

查看 [故障排除文档](./troubleshooting.md) 中的详细解决方案。

### 端口被占用

如果 5173 端口被占用，可以修改 `vite.config.ts` 中的端口配置。

### 热重载不工作

1. 确保运行在开发模式（`pnpm run dev`）
2. 检查文件是否在监听目录中
3. 尝试重启开发服务器

### 其他问题

更多问题请查看 [故障排除文档](./troubleshooting.md)。
