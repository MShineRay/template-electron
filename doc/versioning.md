# 版本号管理

本文档说明如何管理 Electron 应用的版本号。

> 📖 **多环境版本管理**：查看 [版本号管理策略](./version-management.md) 了解如何为不同环境（开发、测试、生产）设计版本号。

## 版本号格式

Electron Builder 要求版本号遵循**语义化版本（Semantic Versioning）**规范：

```
major.minor.patch
```

### 版本号规则

- ✅ **正确格式**：`1.0.0`、`1.0.1`、`1.2.3`、`2.0.0`
- ❌ **错误格式**：`1.0.0.20251230001`、`1.0.0-beta`、`v1.0.0`

### 版本号组成部分

- **major**（主版本号）：不兼容的 API 修改
- **minor**（次版本号）：向下兼容的功能性新增
- **patch**（修订号）：向下兼容的问题修正

## 更新版本号

### 方法 1：使用 npm version（推荐）

```bash
# 修订号 +1（1.0.0 -> 1.0.1）
npm version patch

# 次版本号 +1（1.0.0 -> 1.1.0）
npm version minor

# 主版本号 +1（1.0.0 -> 2.0.0）
npm version major
```

这会自动：
- 更新 `package.json` 中的版本号
- 创建 git commit
- 创建 git tag

### 方法 2：手动编辑 package.json

```json
{
  "version": "1.0.0"
}
```

### 方法 3：使用 pnpm version

```bash
pnpm version patch
pnpm version minor
pnpm version major
```

## 包含构建号

如果需要包含构建号（如 `1.0.0.20251230001`），可以使用以下方法：

### 方法 1：使用 buildVersion（推荐）

在 `electron-builder.yml` 中配置：

```yaml
version: 1.0.0
buildVersion: 20251230001  # 构建号
```

### 方法 2：使用环境变量

```bash
# 设置构建号
export BUILD_NUMBER=20251230001
pnpm run dist:prod
```

在 `electron-builder.yml` 中引用：

```yaml
buildVersion: ${BUILD_NUMBER}
```

### 方法 3：在代码中动态设置

在打包脚本中动态修改版本号：

```bash
# 获取当前日期作为构建号
BUILD_NUMBER=$(date +%Y%m%d%H%M%S)
export BUILD_NUMBER
pnpm run dist:prod
```

## 版本号最佳实践

### 开发阶段

```json
{
  "version": "0.1.0"  // 开发版本
}
```

### 测试阶段

```json
{
  "version": "1.0.0-beta.1"  // 使用预发布版本
}
```

### 生产发布

```json
{
  "version": "1.0.0"  // 正式版本
}
```

## 常见错误

### 错误：Invalid version

**错误信息**：
```
Invalid version: "1.0.0.20251230001"
```

**原因**：版本号格式不符合 SemVer 规范

**解决方案**：
1. 将版本号改为 `major.minor.patch` 格式
2. 如果需要构建号，使用 `buildVersion` 配置

### 错误：Version must be a valid semver string

**原因**：版本号包含非法字符

**解决方案**：
- 移除 `v` 前缀（如 `v1.0.0` → `1.0.0`）
- 移除特殊字符
- 确保格式为 `major.minor.patch`

## 版本号示例

### 基础版本

```json
{
  "version": "1.0.0"
}
```

### 带构建号

```yaml
# electron-builder.yml
version: 1.0.0
buildVersion: 20251230001
```

### 预发布版本

```json
{
  "version": "1.0.0-beta.1"
}
```

## 自动化版本管理

### 使用脚本自动更新版本

创建 `scripts/version.js`：

```javascript
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 获取构建号（日期时间戳）
const buildNumber = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '');

// 更新版本号
const [major, minor, patch] = packageJson.version.split('.');
packageJson.version = `${major}.${minor}.${patch}`;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 导出构建号供 electron-builder 使用
process.env.BUILD_NUMBER = buildNumber;
```

在 `package.json` 中使用：

```json
{
  "scripts": {
    "version:build": "node scripts/version.js",
    "dist:prod": "pnpm run version:build && pnpm run build:prod && electron-builder --config electron-builder.prod.yml"
  }
}
```

## 参考资源

- [语义化版本规范](https://semver.org/)
- [Electron Builder 版本配置](https://www.electron.build/configuration/configuration)

