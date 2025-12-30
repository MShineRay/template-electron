# pnpm 与 Electron 兼容性说明

## 为什么 pnpm 与 Electron 会有兼容性问题？

### 问题根源

pnpm 和 yarn/npm 在依赖管理方式上有根本性差异：

1. **依赖管理方式**
   - **npm/yarn**：使用扁平化的 `node_modules` 结构，所有依赖都在同一层级
   - **pnpm（默认）**：使用符号链接和硬链接，依赖存储在全局存储中，通过符号链接引用

2. **Electron 的特殊性**
   - Electron 需要在 `postinstall` 脚本中下载平台特定的二进制文件
   - Electron 的二进制文件路径是硬编码的，期望在 `node_modules/electron/dist/Electron.app` 这样的位置
   - pnpm 的符号链接结构可能导致 Electron 无法找到其二进制文件

3. **构建脚本执行**
   - pnpm 默认可能忽略某些构建脚本
   - Electron 的 `postinstall` 脚本必须执行才能下载二进制文件

## 解决方案

### 方案 1：使用 hoisted 链接器 + 手动安装脚本（推荐，已配置）

在 `.npmrc` 中配置：

```ini
node-linker=hoisted
shamefully-hoist=true
public-hoist-pattern[]=*electron*
enable-pre-post-scripts=true
```

在 `package.json` 的 `postinstall` 脚本中添加：

```json
{
  "scripts": {
    "postinstall": "electron-builder install-app-deps && node node_modules/electron/install.js"
  }
}
```

**为什么需要手动运行安装脚本？**

即使配置了 `enable-pre-post-scripts=true`，pnpm 有时仍可能跳过 Electron 的 postinstall 脚本。手动在 `postinstall` 中运行 `install.js` 可以确保二进制文件总是被下载。

**优点**：
- 使用类似 npm/yarn 的扁平化结构
- 完全兼容 Electron
- 确保二进制文件总是被下载
- 不需要修改代码

**缺点**：
- 失去了 pnpm 的磁盘空间优势
- 依赖结构类似 npm/yarn

### 方案 2：手动执行 Electron 安装脚本

如果方案 1 不行，可以手动执行：

```bash
node node_modules/.pnpm/electron@*/node_modules/electron/install.js
```

### 方案 3：使用 electron-builder 的 install-app-deps

```bash
pnpm run postinstall
# 这会运行 electron-builder install-app-deps
```

## 当前项目配置

项目已配置为使用 **hoisted 链接器**，这意味着：

1. ✅ 依赖结构类似 npm/yarn（扁平化）
2. ✅ Electron 二进制文件可以被正确找到
3. ✅ 所有构建脚本都会执行
4. ✅ 完全兼容 Electron

### 配置文件说明

**`.npmrc`**：
```ini
node-linker=hoisted          # 使用 hoisted 链接器（关键）
shamefully-hoist=true        # 提升所有依赖
public-hoist-pattern[]=*electron*  # 确保 Electron 被提升
enable-pre-post-scripts=true # 允许运行构建脚本
```

**`.pnpmrc`**：
```ini
node-linker=hoisted
shamefully-hoist=true
public-hoist-pattern[]=*electron*
enable-pre-post-scripts=true
```

## 验证配置

安装依赖后，验证 Electron 是否正确安装：

```bash
# 方法 1: 检查 Electron 二进制文件
ls -la node_modules/electron/dist/

# 方法 2: 尝试加载 Electron
pnpm run postinstall:electron

# 方法 3: 直接运行 Electron
pnpm run start
```

## 常见问题

### Q: 为什么 yarn 可以但 pnpm 不行？

**A**: yarn 使用扁平化的 node_modules 结构，Electron 可以轻松找到二进制文件。pnpm 默认使用符号链接，Electron 的硬编码路径可能无法正确解析。

### Q: 使用 hoisted 链接器会失去 pnpm 的优势吗？

**A**: 会部分失去磁盘空间优势，但仍然保留：
- 更快的安装速度
- 更严格的依赖管理
- 更好的 monorepo 支持
- 锁定文件确保一致性

### Q: 可以同时支持 yarn 和 pnpm 吗？

**A**: 可以，但需要确保：
- 使用 hoisted 链接器（pnpm）
- 两种包管理器都能正确安装 Electron
- 锁定文件（yarn.lock 和 pnpm-lock.yaml）可以共存

## 最佳实践

1. **优先使用 hoisted 链接器**：对于 Electron 项目，这是最可靠的方案
2. **确保构建脚本执行**：不要使用 `--ignore-scripts` 标志
3. **验证安装**：安装后运行 `pnpm run postinstall:electron` 验证
4. **清理重装**：如果遇到问题，清理后重新安装：
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

## 参考资源

- [pnpm 官方文档 - node-linker](https://pnpm.io/npmrc#node-linker)
- [Electron 安装问题排查](https://www.electronjs.org/docs/latest/tutorial/installation)
- [pnpm 与 Electron 兼容性讨论](https://github.com/pnpm/pnpm/issues)

