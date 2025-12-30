# 打包文件说明

本文档说明如何识别不同平台的安装包文件，以及如何在 Mac 上打包 Windows 和 Linux 安装包。

## 文件格式识别

### macOS 安装包

#### DMG 文件（推荐）

- **文件扩展名**：`.dmg`
- **文件名示例**：
  - `Template Electron-1.0.0-arm64.dmg`（生产环境）
  - `Template Electron (Dev)-1.0.0-arm64.dmg`（开发环境）
- **说明**：macOS 磁盘镜像文件，最常见的 macOS 安装包格式
- **使用方法**：双击打开，将应用拖拽到 Applications 文件夹

#### ZIP 文件

- **文件扩展名**：`.zip`
- **文件名示例**：
  - `Template Electron-1.0.0-arm64-mac.zip`（生产环境）
  - `Template Electron (Dev)-1.0.0-arm64-mac.zip`（开发环境）
- **说明**：压缩包格式，解压后直接运行
- **使用方法**：解压后运行其中的 `.app` 文件

#### 架构标识

- `arm64`：Apple Silicon (M1/M2/M3 等)
- `x64`：Intel 芯片 Mac

### Windows 安装包

#### NSIS 安装程序（推荐）

- **文件扩展名**：`.exe`
- **文件名示例**：
  - `Template Electron Setup 1.0.0.exe`（生产环境）
  - `Template Electron (Dev) Setup 1.0.0.exe`（开发环境）
- **说明**：Windows 安装程序，需要安装
- **使用方法**：双击运行安装向导

#### 便携版（Portable）

- **文件扩展名**：`.exe`
- **文件名示例**：
  - `Template Electron 1.0.0.exe`（生产环境）
  - `Template Electron (Dev) 1.0.0.exe`（开发环境）
- **说明**：便携版，无需安装，直接运行
- **使用方法**：双击直接运行

### Linux 安装包

#### AppImage

- **文件扩展名**：`.AppImage`
- **文件名示例**：
  - `Template Electron-1.0.0.AppImage`（生产环境）
  - `Template Electron (Dev)-1.0.0.AppImage`（开发环境）
- **说明**：通用 Linux 格式，无需安装
- **使用方法**：
  ```bash
  chmod +x Template\ Electron-1.0.0.AppImage
  ./Template\ Electron-1.0.0.AppImage
  ```

#### DEB 包

- **文件扩展名**：`.deb`
- **文件名示例**：
  - `template-electron_1.0.0_amd64.deb`（生产环境）
  - `template-electron-dev_1.0.0_amd64.deb`（开发环境）
- **说明**：Debian/Ubuntu 安装包
- **使用方法**：
  ```bash
  sudo dpkg -i template-electron_1.0.0_amd64.deb
  ```

## 文件命名规则

### 生产环境

```
Template Electron-{版本}-{架构}.{扩展名}
Template Electron Setup {版本}.exe
```

### 开发环境

```
Template Electron (Dev)-{版本}-{架构}.{扩展名}
Template Electron (Dev) Setup {版本}.exe
```

## 输出目录

打包后的文件会输出到以下目录：

- **生产环境**：`release/prod/`
- **开发环境**：`release/dev/`
- **默认配置**：`release/`

## 快速识别

### 按文件扩展名

- **`.dmg`** → macOS 安装包（推荐）
- **`.zip`** → macOS 压缩包
- **`.exe`** → Windows 安装包或便携版
- **`.AppImage`** → Linux 通用格式
- **`.deb`** → Linux Debian/Ubuntu 安装包

### 按文件名关键词

- 包含 `Setup` → Windows 安装程序
- 包含 `arm64` 或 `x64` → macOS（架构标识）
- 包含 `amd64` → Linux（架构标识）
- 包含 `(Dev)` → 开发环境版本

## 实际示例

从你的打包输出可以看到：

```
release/dev/
├── Template Electron (Dev)-1.0.0-arm64.dmg          # macOS DMG 安装包
├── Template Electron (Dev)-1.0.0-arm64-mac.zip     # macOS ZIP 压缩包
└── ...
```

## 推荐使用

### macOS

- **推荐**：`.dmg` 文件（标准安装包格式）
- **备选**：`.zip` 文件（便携使用）

### Windows

- **推荐**：`Setup.exe`（安装程序，适合正式分发）
- **备选**：便携版 `.exe`（无需安装，适合测试）

### Linux

- **推荐**：`.AppImage`（通用格式，无需安装）
- **备选**：`.deb`（适合 Debian/Ubuntu 系统）

## 注意事项

1. **架构匹配**：确保下载的安装包架构与你的系统匹配
   - macOS：`arm64`（Apple Silicon）或 `x64`（Intel）
   - Windows：通常是 `x64`
   - Linux：`amd64`（x64）或 `arm64`

2. **开发环境 vs 生产环境**：
   - 开发环境版本名称包含 `(Dev)` 后缀
   - 生产环境版本是标准名称

3. **文件大小**：
   - macOS DMG：通常 100-150MB
   - Windows Setup：通常 100-150MB
   - Linux AppImage：通常 100-150MB
