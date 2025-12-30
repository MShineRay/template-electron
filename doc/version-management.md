# 版本号管理策略

本文档说明如何为不同环境（开发、测试、生产）设计和管理版本号。

## 版本号策略

### 开发环境（Dev）

**版本号格式**：`1.0.0-dev.20251230143000`

- **基础版本**：从 `package.json` 读取（如 `1.0.0`）
- **环境标识**：`-dev`
- **构建号**：日期时间戳（`YYYYMMDDHHMMSS`，使用本地时间）
- **示例**：`1.0.0-dev.20251230143000`

**特点**：
- 每次打包都会生成新的版本号
- 包含构建时间信息
- 便于追踪开发版本

### 测试环境（Test）

**版本号格式**：`1.0.0-beta.1`

- **基础版本**：从 `package.json` 读取（如 `1.0.0`）
- **环境标识**：`-beta`
- **构建号**：递增的测试版本号（`1`, `2`, `3`...）
- **示例**：`1.0.0-beta.1`、`1.0.0-beta.2`

**特点**：
- 版本号相对稳定
- 便于测试团队追踪版本
- 可以手动控制测试版本号

### 生产环境（Prod）

**版本号格式**：`1.0.0`

- **基础版本**：从 `package.json` 读取
- **无环境标识**：使用正式版本号
- **无构建号**：保持版本号简洁

**特点**：
- 使用语义化版本号
- 版本号需要手动更新
- 适合正式发布

## 版本号管理流程

### 1. 更新基础版本号

在 `package.json` 中设置基础版本号：

```json
{
  "version": "1.0.0"
}
```

### 2. 自动生成环境版本号

使用版本管理脚本自动生成：

```bash
# 开发环境
pnpm run version:dev
# 生成：1.0.0-dev.20251230120000

# 测试环境
pnpm run version:test
# 生成：1.0.0-beta.1

# 生产环境
pnpm run version:prod
# 生成：1.0.0
```

### 3. 打包时自动应用版本号

打包命令会自动调用版本管理脚本：

```bash
# 开发环境打包（自动生成开发版本号）
pnpm run dist:dev

# 测试环境打包（自动生成测试版本号）
pnpm run dist:test

# 生产环境打包（使用正式版本号）
pnpm run dist:prod
```

## 版本号生成规则

### 开发环境版本号

```javascript
// 格式：{baseVersion}-dev.{buildNumber}
// buildNumber = YYYYMMDDHHMMSS

示例：
基础版本: 1.0.0
构建时间: 2025-12-30 12:00:00
生成版本: 1.0.0-dev.20251230120000
```

### 测试环境版本号

```javascript
// 格式：{baseVersion}-beta.{testNumber}
// testNumber 从环境变量 TEST_VERSION_NUMBER 读取，默认为 1

示例：
基础版本: 1.0.0
测试版本号: 1
生成版本: 1.0.0-beta.1

// 指定测试版本号
TEST_VERSION_NUMBER=2 pnpm run version:test
生成版本: 1.0.0-beta.2
```

### 生产环境版本号

```javascript
// 格式：{baseVersion}
// 直接使用 package.json 中的版本号

示例：
基础版本: 1.0.0
生成版本: 1.0.0
```

## 使用示例

### 开发环境

```bash
# 1. 自动生成开发版本号并打包
pnpm run dist:dev

# 输出：
# ✅ 版本号已更新为: 1.0.0-dev.20251230120000
# ✅ 构建号: 20251230120000
# 📦 环境: dev
# 📌 版本: 1.0.0-dev.20251230120000
```

### 测试环境

```bash
# 1. 自动生成测试版本号并打包
pnpm run dist:test

# 2. 指定测试版本号
TEST_VERSION_NUMBER=2 pnpm run dist:test

# 输出：
# ✅ 版本号已更新为: 1.0.0-beta.2
# ✅ 构建号: 2
# 📦 环境: test
# 📌 版本: 1.0.0-beta.2
```

### 生产环境

```bash
# 1. 更新基础版本号（如果需要）
npm version patch  # 1.0.0 -> 1.0.1

# 2. 使用正式版本号打包
pnpm run dist:prod

# 输出：
# ✅ 版本号已更新为: 1.0.1
# 📦 环境: prod
# 📌 版本: 1.0.1
```

## 版本号文件

版本管理脚本会将版本信息自动追加到对应的 `.env` 文件中：

- `.env.development` - 开发环境配置（包含构建信息）
- `.env.production` - 生产环境配置（包含构建信息）

构建信息会自动追加到文件末尾，格式如下：

```bash
# ============================================
# 构建信息（自动生成，请勿手动修改）
# ============================================
VERSION=1.0.0-dev.20251230120000
BUILD_VERSION=20251230120000
BUILD_TIME=2025-12-30T12:00:00.000Z
BUILD_TIME_LOCAL=2025-12-30 14:00:00
BUILD_ENV=dev
```

**注意**：构建信息部分会在每次运行版本管理脚本时自动更新，请勿手动修改。

## 版本号在应用中的使用

### 在主进程中获取版本号

```typescript
import { app } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';

// 获取应用版本号
const appVersion = app.getVersion();

// 读取构建信息（如果存在）
const buildInfoPath = join(__dirname, '../.env.production.version');
try {
  const buildInfo = readFileSync(buildInfoPath, 'utf8');
  // 解析构建信息
} catch {
  // 文件不存在，使用默认值
}
```

### 在渲染进程中显示版本号

```typescript
// 通过 IPC 获取版本号
const version = await window.electronAPI.app.getVersion();
console.log('应用版本:', version);
```

## 版本号更新策略

### 开发阶段

- 基础版本：`0.1.0`（开发中）
- 每次打包自动生成新的开发版本号
- 不需要手动更新基础版本

### 测试阶段

- 基础版本：`1.0.0`（准备发布）
- 测试版本号递增：`beta.1` → `beta.2` → `beta.3`
- 可以通过环境变量控制测试版本号

### 生产发布

- 基础版本：`1.0.0`（正式发布）
- 使用 `npm version` 更新版本号
- 版本号遵循语义化版本规范

## 版本号比较

| 环境 | 版本号格式 | 示例 | 更新频率 |
|------|----------|------|---------|
| 开发 | `{base}-dev.{timestamp}` | `1.0.0-dev.20251230120000` | 每次打包 |
| 测试 | `{base}-beta.{number}` | `1.0.0-beta.1` | 手动控制 |
| 生产 | `{base}` | `1.0.0` | 手动更新 |

## 最佳实践

1. **开发环境**：
   - 使用自动生成的构建号
   - 每次打包都有唯一版本号
   - 便于追踪和调试

2. **测试环境**：
   - 使用递增的测试版本号
   - 便于测试团队报告问题
   - 可以回退到特定测试版本

3. **生产环境**：
   - 使用语义化版本号
   - 版本号需要谨慎更新
   - 遵循版本号规范

## 自动化版本管理

### CI/CD 集成

在 CI/CD 中自动管理版本号：

```yaml
# .github/workflows/build.yml
jobs:
  build-dev:
    steps:
      - run: pnpm run version:dev
      - run: pnpm run dist:dev
  
  build-test:
    steps:
      - run: pnpm run version:test
      - run: pnpm run dist:test
  
  build-prod:
    steps:
      - run: npm version patch
      - run: pnpm run version:prod
      - run: pnpm run dist:prod
```

## 常见问题

### Q: 如何查看当前版本号？

A: 查看 `package.json` 中的 `version` 字段，或运行：
```bash
node scripts/version.js dev
```

### Q: 如何手动设置测试版本号？

A: 使用环境变量：
```bash
TEST_VERSION_NUMBER=5 pnpm run dist:test
```

### Q: 版本号会提交到 Git 吗？

A: 是的，`package.json` 中的版本号会提交。`.env.*.version` 文件已添加到 `.gitignore`。

### Q: 如何回退版本号？

A: 使用 Git 回退 `package.json`，或手动编辑版本号。

