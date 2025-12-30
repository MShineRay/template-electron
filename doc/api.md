# API 文档

本文档介绍项目中可用的 API 接口。

## 渲染进程 API

通过 `window.electronAPI` 访问以下 API。

> **注意**：`window.electronAPI` 不是 Electron 自带的 API，而是项目通过 preload 脚本（`src/main/preload.ts`）使用 `contextBridge.exposeInMainWorld` 暴露的自定义 API。它提供了安全的主进程和渲染进程通信接口。

### 窗口控制 API

#### `window.minimize()`

最小化窗口。

```typescript
await window.electronAPI.window.minimize();
```

#### `window.maximize()`

最大化或还原窗口。

```typescript
await window.electronAPI.window.maximize();
```

#### `window.close()`

关闭窗口。

```typescript
await window.electronAPI.window.close();
```

#### `window.toggleFullscreen()`

切换全屏模式。

```typescript
await window.electronAPI.window.toggleFullscreen();
```

#### `window.getState()`

获取窗口状态。

```typescript
const state = await window.electronAPI.window.getState();
// 返回: { isMaximized: boolean, isFullScreen: boolean, isMinimized: boolean }
```

### 配置管理 API

#### `config.get(key: string)`

获取配置项。

```typescript
const theme = await window.electronAPI.config.get('theme');
```

#### `config.set(key: string, value: any)`

设置配置项。

```typescript
await window.electronAPI.config.set('theme', 'dark');
```

#### `config.getAll()`

获取所有配置。

```typescript
const allConfig = await window.electronAPI.config.getAll();
```

#### `config.reset()`

重置所有配置为默认值。

```typescript
await window.electronAPI.config.reset();
```

### 应用信息 API

#### `app.getVersion()`

获取应用版本。

```typescript
const version = await window.electronAPI.app.getVersion();
```

#### `app.getName()`

获取应用名称。

```typescript
const name = await window.electronAPI.app.getName();
```

## 主进程模块

### WindowManager

窗口管理器，负责创建和管理应用窗口。

```typescript
import { WindowManager } from './modules/window-manager';

const windowManager = new WindowManager(logger, configManager);
windowManager.createMainWindow();
```

### ConfigManager

配置管理器，负责应用配置的持久化存储。

```typescript
import { ConfigManager } from './modules/config-manager';

const configManager = new ConfigManager();
configManager.set('theme', 'dark');
const theme = configManager.get('theme');
```

### Logger

日志记录器，提供多级别日志功能。

```typescript
import { Logger } from './modules/logger';

const logger = new Logger();
logger.info('信息日志');
logger.error('错误日志');
logger.warn('警告日志');
logger.debug('调试日志');
```

## 类型定义

所有 API 都有完整的 TypeScript 类型定义，可以在 IDE 中获得自动补全和类型检查。
