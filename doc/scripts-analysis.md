# 打包脚本分析

## pack vs dist 的区别

### `pack:` - 仅打包（不构建）

**用途**：假设代码已经构建完成，只进行打包操作。

**特点**：
- 不执行构建步骤（`pnpm run build`）
- 直接运行 `electron-builder`
- 适合在已经构建好的代码基础上快速打包

**示例**：
```bash
# 先构建
pnpm run build

# 然后打包（不重新构建）
pnpm run pack:dev
```

### `dist:` - 构建 + 打包

**用途**：完整的构建和打包流程。

**特点**：
- 先执行构建步骤（`pnpm run build`）
- 然后执行打包（`electron-builder`）
- 包含版本号更新（`version:dev`, `version:prod` 等）
- 适合完整的发布流程

**示例**：
```bash
# 一步完成：更新版本号 + 构建 + 打包
pnpm run dist:prod
```

## 脚本对比

| 脚本 | 版本号更新 | 构建 | 打包 | 用途 |
|------|----------|------|------|------|
| `pack` | ❌ | ❌ | ✅ | 仅打包（需先构建） |
| `pack:dev` | ✅ | ❌ | ✅ | 开发环境打包（需先构建） |
| `pack:prod` | ✅ | ❌ | ✅ | 生产环境打包（需先构建） |
| `dist` | ❌ | ✅ | ✅ | 构建 + 打包（默认配置） |
| `dist:dev` | ✅ | ✅ | ✅ | 开发环境完整流程 |
| `dist:prod` | ✅ | ✅ | ✅ | 生产环境完整流程 |

## 冗余分析

### 1. 平台特定脚本冗余

**问题**：
- `pack:win`, `pack:linux`, `pack:mac` - 没有版本号更新，也没有构建
- `dist:win`, `dist:linux`, `dist:mac` - 有构建，但没有版本号更新
- `pack:win:dev`, `pack:win:prod` 等 - 有版本号更新，但没有构建
- `dist:win:dev`, `dist:win:prod` 等 - 完整流程，但与 `dist:dev` 功能重复

**建议**：
- 保留 `dist:dev` 和 `dist:prod`（自动检测当前平台）
- 如果需要跨平台打包，使用 `--win`, `--mac`, `--linux` 参数
- 删除冗余的平台特定脚本

### 2. 环境变量冗余

**问题**：
- `dist:dev` 中有 `BUILD_VERSION=${BUILD_VERSION:-$(date +%Y%m%d%H%M%S)}`，但这个变量没有被使用
- 版本号已经通过 `version:dev` 脚本更新到 `.env.development` 中

**建议**：
- 移除未使用的 `BUILD_VERSION` 环境变量

## 多平台打包

### 一键打包所有平台

项目提供了同时打包多个平台的脚本：

```bash
# 开发环境：同时打包 macOS、Windows、Linux
pnpm run dist:all:dev

# 生产环境：同时打包 macOS、Windows、Linux
pnpm run dist:all:prod

# 测试环境：同时打包 macOS、Windows、Linux
pnpm run dist:all:test
```

**注意**：在 Mac 上打包 Windows 安装包需要安装 Wine：
```bash
brew install --cask wine-stable
```

### 打包脚本说明

| 脚本 | 说明 | 平台 |
|------|------|------|
| `dist:all` | 构建 + 打包所有平台（默认配置） | macOS, Windows, Linux |
| `dist:all:dev` | 开发环境：构建 + 打包所有平台 | macOS, Windows, Linux |
| `dist:all:prod` | 生产环境：构建 + 打包所有平台 | macOS, Windows, Linux |
| `pack:all` | 仅打包所有平台（需先构建） | macOS, Windows, Linux |
| `pack:all:dev` | 开发环境：仅打包所有平台 | macOS, Windows, Linux |
| `pack:all:prod` | 生产环境：仅打包所有平台 | macOS, Windows, Linux |

### 方案 2：保留所有脚本（当前方案）

如果团队需要明确的平台特定脚本，可以保留，但需要：
1. 统一脚本命名规范
2. 确保所有脚本都包含必要的步骤（版本号更新、构建等）
3. 更新文档说明每个脚本的用途

