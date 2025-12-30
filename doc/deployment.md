# 部署指南

本文档介绍如何打包和部署 Electron 应用。

## 构建应用

### 开发构建

```bash
# 构建主进程和渲染进程
pnpm run build
# 或
npm run build
```

构建输出：

- 主进程：`dist/main.js`
- 渲染进程：`dist/renderer/`

### 生产构建

```bash
# 构建并打包应用
pnpm run dist
# 或
npm run dist
```

## 打包配置

项目支持多环境打包配置：

- **默认配置**：`electron-builder.yml`
- **开发环境**：`electron-builder.dev.yml`
- **生产环境**：`electron-builder.prod.yml`

### 配置文件说明

#### 开发环境配置 (`electron-builder.dev.yml`)

- 应用名称包含 "(Dev)" 后缀
- 输出到 `release/dev/` 目录
- 适合内部测试和开发使用

#### 生产环境配置 (`electron-builder.prod.yml`)

- 标准应用名称
- 输出到 `release/prod/` 目录
- 适合正式发布和分发
- 包含更多安全配置（如 macOS 的 hardenedRuntime）

### 支持的平台格式

- **macOS**：DMG、ZIP
- **Windows**：NSIS 安装程序、便携版
- **Linux**：AppImage、DEB

### 自定义打包配置

编辑对应的配置文件（`electron-builder.yml`、`electron-builder.dev.yml` 或 `electron-builder.prod.yml`）：

```yaml
appId: com.example.template-electron
productName: Template Electron
directories:
  output: release
files:
  - dist/**/*
  - package.json
```

## 打包命令

### 按环境打包

项目支持区分开发环境和生产环境打包：

#### 开发环境打包

```bash
# 构建并打包（开发环境，当前平台）
pnpm run dist:dev

# 构建并打包所有平台（开发环境）
pnpm run dist:all:dev

# 仅打包（开发环境，需要先构建）
pnpm run pack:dev

# 仅打包所有平台（开发环境，需要先构建）
pnpm run pack:all:dev
```

**输出目录**：`release/dev/`

#### 生产环境打包（推荐）

```bash
# 构建并打包（生产环境，当前平台）
pnpm run dist:prod

# 构建并打包所有平台（生产环境）
pnpm run dist:all:prod

# 仅打包（生产环境，需要先构建）
pnpm run pack:prod

# 仅打包所有平台（生产环境，需要先构建）
pnpm run pack:all:prod
```

**输出目录**：`release/prod/`

#### 默认打包（使用默认配置）

```bash
# 构建并打包（使用默认配置）
pnpm run dist
# 或
npm run dist

# 仅打包（使用默认配置）
pnpm run pack
# 或
npm run pack
```

**输出目录**：`release/`

### 环境配置说明

- **开发环境** (`dist:dev` / `pack:dev`)：
  - 使用 `electron-builder.dev.yml` 配置
  - 应用名称包含 "(Dev)" 后缀
  - 输出到 `release/dev/` 目录
  - 适合内部测试和开发使用

- **生产环境** (`dist:prod` / `pack:prod`)：
  - 使用 `electron-builder.prod.yml` 配置
  - 标准应用名称
  - 输出到 `release/prod/` 目录
  - 适合正式发布和分发

## 平台特定说明

### macOS

- 需要代码签名才能分发（可选）
- DMG 文件可以直接分发
- 支持自动更新（需要配置）

### Windows

- NSIS 安装程序：适合正式分发
- 便携版：无需安装，直接运行
- 需要代码签名才能避免 Windows Defender 警告

### Linux

- AppImage：通用格式，无需安装
- DEB：适合 Debian/Ubuntu 系统
- 可能需要配置依赖项

## 发布流程

### 1. 更新版本号

版本号必须遵循语义化版本（SemVer）规范：`major.minor.patch`

```bash
# 使用 npm version 更新版本
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 或手动编辑 package.json
# "version": "1.0.0"  ✅ 正确
# "version": "1.0.0.20251230001"  ❌ 错误（不支持第四部分）
```

**如果需要包含构建号**：

可以在 `electron-builder.yml` 中配置 `buildVersion`：

```yaml
version: 1.0.0
buildVersion: 20251230001 # 构建号（可选）
```

或者使用环境变量：

```bash
# 设置构建号
export BUILD_NUMBER=20251230001
pnpm run dist:prod
```

### 2. 构建应用

```bash
pnpm run build
```

### 3. 打包应用

```bash
pnpm run dist
```

### 4. 测试打包结果

在 `release/` 目录下找到打包好的应用，进行测试。

### 5. 分发

- 上传到 GitHub Releases
- 上传到应用商店
- 通过网站分发

## 自动更新

如需实现自动更新功能，可以集成 `electron-updater`：

1. 安装依赖：`pnpm add electron-updater`
2. 在主进程中配置更新检查
3. 配置更新服务器或使用 GitHub Releases

## 常见问题

### 打包文件过大

- 使用 `asar` 打包（默认启用）
- 排除不必要的文件
- 使用代码分割

### 打包失败

- 检查 Node.js 版本
- 确保所有依赖已安装
- 查看错误日志

## 跨平台打包

### 在 Mac 上打包不同平台

Electron Builder 支持跨平台打包，但有一些限制：

#### macOS 打包（当前平台）

```bash
# 打包 macOS 安装包
pnpm run pack:mac
pnpm run pack:mac:dev
pnpm run pack:mac:prod

# 构建并打包
pnpm run dist:mac
pnpm run dist:mac:dev
pnpm run dist:mac:prod
```

#### Windows 打包（从 Mac）

**方法 1：使用 Wine（推荐）**

在 Mac 上打包 Windows 安装包需要安装 Wine：

```bash
# 使用 Homebrew 安装 Wine
brew install --cask wine-stable

# 然后就可以打包 Windows 安装包了
pnpm run pack:win
pnpm run pack:win:dev
pnpm run pack:win:prod

# 构建并打包
pnpm run dist:win
pnpm run dist:win:dev
pnpm run dist:win:prod
```

**方法 2：使用虚拟机或 CI/CD**

- 使用 Windows 虚拟机（Parallels Desktop、VMware Fusion）
- 使用 CI/CD 服务（GitHub Actions、GitLab CI）在 Windows 环境中打包

**注意事项**：

- Wine 可能不稳定，建议在 Windows 系统上打包以获得最佳结果
- 某些 Windows 特定功能可能无法在 Mac 上测试

#### Linux 打包（从 Mac）

```bash
# 打包 Linux 安装包
pnpm run pack:linux
pnpm run pack:linux:dev
pnpm run pack:linux:prod

# 构建并打包
pnpm run dist:linux
pnpm run dist:linux:dev
pnpm run dist:linux:prod
```

**注意事项**：

- Linux 打包通常不需要额外工具
- 但某些 Linux 特定功能可能无法在 Mac 上测试

### 打包所有平台

```bash
# 打包当前平台（Mac 上会打包 Mac 和 Linux，需要 Wine 才能打包 Windows）
pnpm run dist:prod

# 或者分别打包
pnpm run dist:mac:prod
pnpm run dist:linux:prod
pnpm run dist:win:prod  # 需要 Wine
```

### 推荐方案

1. **开发阶段**：在各自平台上打包和测试
2. **生产发布**：使用 CI/CD 在多个平台上自动打包
3. **快速测试**：在 Mac 上使用 Wine 打包 Windows（可能不稳定）

### 使用 CI/CD 跨平台打包

推荐使用 GitHub Actions 在多个平台上自动打包：

```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run dist:prod
```

### 常见问题

**Q: 在 Mac 上打包 Windows 失败？**

A: 需要安装 Wine：

```bash
brew install --cask wine-stable
```

**Q: Wine 安装失败？**

A: 可以：

1. 使用 Windows 虚拟机
2. 使用 CI/CD 服务
3. 在 Windows 系统上打包

**Q: 打包速度慢？**

A: 跨平台打包需要下载对应平台的 Electron 二进制文件，首次打包会较慢。

- 在 Windows 上打包 Windows 版本
- 使用 CI/CD 进行自动化打包
