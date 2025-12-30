# 环境变量配置指南

本文档介绍如何配置和使用环境变量。

## 环境文件

项目支持以下环境配置文件：

- `.env` - 所有环境的默认配置（可选，会被环境特定文件覆盖）
- `.env.development` - 开发环境配置（开发模式时使用，包含自动生成的构建信息）
- `.env.production` - 生产环境配置（生产模式时使用，包含自动生成的构建信息）
- `.env.local` - 本地覆盖配置（可选，不提交到版本控制）
- `.env.[mode].local` - 环境特定的本地覆盖（可选，不提交到版本控制）
- `.env.example` - 环境变量示例文件（应提交到版本控制，仅作为参考）

**加载顺序**（后加载的会覆盖先加载的）：

1. `.env`（基础配置）
2. `.env.[mode]`（环境特定配置，如 `.env.development`）
3. `.env.local`（本地覆盖）
4. `.env.[mode].local`（环境特定的本地覆盖）

**构建信息**：

- `.env.development` 和 `.env.production` 文件末尾会自动包含构建信息（版本号、构建时间等）
- 构建信息由版本管理脚本（`scripts/version.js`）自动生成和更新
- 构建信息部分请勿手动修改

## 环境变量命名规则

### 渲染进程环境变量

渲染进程（前端）的环境变量必须以 `VITE_` 开头，这样才能被 Vite 识别并注入到代码中。

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Template Electron
```

### 主进程环境变量

主进程（Node.js）可以使用任何环境变量，但建议也使用 `VITE_` 前缀以保持一致性。

```bash
VITE_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```

## 配置示例

### .env.example（示例模板）

`.env.example` 仅作为示例模板，不会被实际加载。实际配置请使用 `.env.development` 或 `.env.production`。

```bash
# 环境变量配置示例
# 此文件仅作为示例模板，不会被实际加载

# 应用配置
VITE_APP_NAME=Template Electron
VITE_APP_VERSION=0.0.1

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# 开发环境配置（仅开发环境需要）
VITE_DEV_PORT=5173
VITE_DEV_HOST=localhost

# 功能开关
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_LOG=true
```

### .env.development（开发环境）

开发模式下自动加载，包含开发环境所需的所有配置。

```bash
# 开发环境配置
VITE_APP_NAME=Template Electron
VITE_APP_VERSION=0.0.1
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_DEV_PORT=5173
VITE_DEV_HOST=localhost
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_LOG=true
```

### .env.production（生产环境）

生产模式下自动加载，只包含生产环境需要的配置（不包含开发服务器配置）。

```bash
# 生产环境配置
VITE_APP_NAME=Template Electron
VITE_APP_VERSION=0.0.1
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_LOG=false
```

## 使用方法

### 在渲染进程中使用

```typescript
// 方式 1: 直接使用 import.meta.env
const apiURL = import.meta.env.VITE_API_BASE_URL;

// 方式 2: 使用环境变量工具（推荐）
import { env } from './utils/env';
const apiURL = env.apiBaseURL;
```

### 在主进程中使用

```typescript
// 方式 1: 直接使用 process.env
const apiURL = process.env.VITE_API_BASE_URL;

// 方式 2: 使用环境变量工具（推荐）
import { env } from './utils/env';
const apiURL = env.apiBaseURL;
```

## 环境变量工具

项目提供了环境变量工具，方便使用：

### 渲染进程 (`src/renderer/utils/env.ts`)

```typescript
import { env } from './utils/env';

console.log(env.appName); // 应用名称
console.log(env.apiBaseURL); // API 基础 URL
console.log(env.isDevelopment); // 是否为开发环境
```

### 主进程 (`src/main/utils/env.ts`)

```typescript
import { env, getEnv, getBoolEnv, getNumberEnv } from './utils/env';

// 使用配置对象
console.log(env.appName);
console.log(env.apiBaseURL);

// 使用工具函数
const customValue = getEnv('CUSTOM_KEY', 'default');
const boolValue = getBoolEnv('ENABLE_FEATURE', false);
const numValue = getNumberEnv('TIMEOUT', 1000);
```

## 环境变量类型定义

渲染进程的环境变量类型定义在 `src/renderer/env.d.ts` 中：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  // ...
}
```

添加新的环境变量时，需要在此文件中声明类型。

## 环境切换

### 开发环境

```bash
# 自动使用 .env.development
pnpm run dev
```

### 生产环境

```bash
# 自动使用 .env.production
pnpm run build
pnpm run dist
```

### 手动指定环境

```bash
# 设置 NODE_ENV
NODE_ENV=production pnpm run build
```

## 最佳实践

1. **不要提交敏感信息**：`.env` 文件包含敏感信息，不应提交到版本控制
2. **使用 .env.example**：提供 `.env.example` 文件作为模板
3. **环境变量命名**：使用清晰、描述性的名称
4. **类型定义**：为渲染进程的环境变量添加类型定义
5. **默认值**：为环境变量提供合理的默认值
6. **文档化**：在文档中说明每个环境变量的用途

## 常见环境变量

### 应用配置

- `VITE_APP_NAME` - 应用名称
- `VITE_APP_VERSION` - 应用版本

### API 配置

- `VITE_API_BASE_URL` - API 基础 URL
- `VITE_API_TIMEOUT` - API 请求超时时间（毫秒）

### 开发配置

- `VITE_DEV_PORT` - 开发服务器端口
- `VITE_DEV_HOST` - 开发服务器主机

### 功能开关

- `VITE_ENABLE_DEVTOOLS` - 是否启用开发者工具
- `VITE_ENABLE_LOG` - 是否启用日志

## 故障排除

### 环境变量未生效

1. 检查变量名是否以 `VITE_` 开头（渲染进程）
2. 检查 `.env` 文件是否在项目根目录
3. 重启开发服务器
4. 检查 `.env` 文件格式是否正确

### 类型错误

1. 在 `src/renderer/env.d.ts` 中添加类型定义
2. 重启 TypeScript 服务器

### 主进程环境变量未加载

1. 确保已安装 `dotenv` 依赖
2. 检查 `src/main/utils/env.ts` 是否正确加载
3. 确保在应用启动前加载环境变量
