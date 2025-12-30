# 准备提交到 GitHub

本文档说明如何将项目提交到 GitHub 仓库。

## 前置检查清单

### ✅ 已完成
- [x] 版本号设置为 `0.0.1`
- [x] 创建 `LICENSE` 文件（MIT）
- [x] 创建 `CHANGELOG.md`
- [x] 创建 `.gitattributes` 文件
- [x] 更新 `.gitignore` 文件
- [x] 添加 GitHub 工作流配置（CI）
- [x] 添加 Issue 和 PR 模板
- [x] 更新 `package.json` 仓库信息

### ✅ 已完成
- [x] 仓库 URL 已更新为：`https://github.com/MShineRay/template-electron.git`
- [x] CHANGELOG.md 中的 Release 链接已更新
- [x] README.md 已添加仓库地址和徽章

### ⚠️ 需要手动完成

#### 1. 清理构建产物
确保以下目录和文件不会被提交：
- `dist/` - 构建输出目录
- `release/` - 打包输出目录
- `node_modules/` - 依赖目录
- `.env.development` 和 `.env.production` 中的构建信息部分（会自动生成）

#### 4. 添加作者信息（可选）
在 `package.json` 中添加作者信息：
```json
"author": "Your Name <your.email@example.com>"
```

## 初始化 Git 仓库

如果还没有初始化 Git 仓库，执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "chore: initial commit v0.0.1"

# 添加远程仓库
git remote add origin https://github.com/MShineRay/template-electron.git

# 创建主分支（如果还没有）
git branch -M main

# 推送到远程仓库
git push -u origin main
```

## 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `template-electron`
   - **Description**: `Electron 基础项目模板`
   - **Visibility**: Public（或 Private，根据你的需求）
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）
4. 点击 "Create repository"

## 推送代码

```bash
# 确保所有更改已提交
git status

# 如果还有未提交的更改，先提交
git add .
git commit -m "chore: prepare for GitHub release v0.0.1"

# 推送到远程仓库
git push -u origin main
```

## 创建 Release

1. 在 GitHub 仓库页面，点击 "Releases"
2. 点击 "Create a new release"
3. 填写信息：
   - **Tag version**: `v0.0.1`
   - **Release title**: `v0.0.1 - Initial Release`
   - **Description**: 可以从 `CHANGELOG.md` 复制内容
4. 点击 "Publish release"

## 后续步骤

### 添加徽章（可选）
在 `README.md` 顶部添加徽章，例如：
```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.1-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
```

### 配置 GitHub Pages（可选）
如果需要托管文档：
1. 在仓库设置中启用 GitHub Pages
2. 选择文档源（例如 `main` 分支的 `doc` 目录）

### 设置分支保护规则（推荐）
1. 在仓库设置中，进入 "Branches"
2. 添加分支保护规则：
   - 保护 `main` 分支
   - 要求 PR 审查
   - 要求通过 CI 检查

## 注意事项

1. **不要提交敏感信息**：
   - 确保 `.env` 文件在 `.gitignore` 中
   - 不要提交 API 密钥、密码等

2. **构建产物**：
   - `dist/` 和 `release/` 目录应该被忽略
   - 这些文件会在 CI/CD 中自动生成

3. **版本号**：
   - 初始版本使用 `0.0.1` 是合理的（遵循 SemVer）
   - 后续版本更新时，使用 `pnpm run version:prod` 自动管理

4. **文档**：
   - 确保所有文档链接正确
   - 更新 README 中的仓库地址（如果有）

---

**最后更新**：2025-12-30

