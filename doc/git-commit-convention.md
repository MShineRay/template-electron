# Git 提交规范

本文档说明项目的 Git 提交规范和如何限制提交格式。

## 提交规范

项目采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，这是一种轻量级的提交规范约定。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型 (type)

提交类型必须是以下之一：

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式变更（不影响代码运行）
- **refactor**: 重构（既不是新功能也不是 bug 修复）
- **perf**: 性能优化
- **test**: 添加或修改测试
- **build**: 构建系统或外部依赖变更（如 webpack、npm）
- **ci**: CI 配置文件和脚本变更
- **chore**: 其他变更（不修改 src 或 test 文件）
- **revert**: 回滚之前的提交

### 作用域 (scope)

可选，表示提交影响的范围。例如：
- `feat(window)`: 窗口相关功能
- `fix(ipc)`: IPC 通信相关修复
- `docs(readme)`: README 文档更新

### 主题 (subject)

- 使用祈使句，现在时态："change" 而不是 "changed" 或 "changes"
- 首字母小写
- 结尾不加句号
- 不超过 50 个字符

### 正文 (body)

可选，用于详细说明：
- 使用祈使句，现在时态
- 说明代码变更的动机和与之前行为的对比

### 页脚 (footer)

可选，用于：
- **BREAKING CHANGE**: 不兼容的变更
- **Closes**: 关闭的 Issue（如 `Closes #123`）

## 提交示例

### 简单提交

```bash
feat: 添加窗口管理模块

docs: 更新 API 文档

fix: 修复 IPC 通信错误
```

### 带作用域的提交

```bash
feat(window): 添加窗口最小化功能

fix(ipc): 修复配置管理 IPC 调用错误

docs(readme): 更新安装说明
```

### 详细提交

```bash
feat(config): 添加配置持久化功能

实现了基于 electron-store 的配置管理模块，
支持配置的读取、设置、删除和重置功能。

Closes #123
```

### 破坏性变更

```bash
feat(api): 重构 IPC API 接口

BREAKING CHANGE: window API 方法名称已更改
- window.minimize() -> window.minimizeWindow()
- window.maximize() -> window.maximizeWindow()
```

## 提交规范检查

项目使用以下工具来限制和检查提交格式：

### 1. commitlint

自动检查提交消息格式是否符合规范。

**配置文件**: `.commitlintrc.js`

**检查时机**: `commit-msg` Git hook

### 2. husky

Git hooks 管理工具，用于在提交时自动运行检查。

**配置文件**: `.husky/`

**Hooks**:
- `pre-commit`: 提交前检查（代码格式、lint 等）
- `commit-msg`: 提交消息格式检查

## 使用方法

### 手动提交

```bash
# 符合规范的提交
git commit -m "feat: 添加新功能"
git commit -m "fix(ipc): 修复通信错误"
git commit -m "docs: 更新文档"

# 不符合规范的提交（会被拒绝）
git commit -m "添加新功能"  # ❌ 缺少 type
git commit -m "fix: 修复"    # ❌ subject 太短
```

### 使用 Commitizen（推荐）

使用交互式工具帮助生成符合规范的提交消息：

```bash
# 安装依赖后
pnpm run commit

# 或使用 npx
npx cz
```

## 常见问题

### Q: 提交被拒绝怎么办？

A: 检查提交消息格式：
1. 确保包含类型（type）
2. 确保 subject 清晰描述变更
3. 确保符合格式：`<type>(<scope>): <subject>`

### Q: 如何修改上一次提交？

A: 使用 `--amend`：

```bash
git commit --amend -m "feat: 正确的提交消息"
```

### Q: 多个提交如何合并？

A: 使用交互式 rebase：

```bash
git rebase -i HEAD~3  # 合并最近 3 个提交
```

### Q: 如何跳过检查（不推荐）？

A: 使用 `--no-verify`（仅紧急情况）：

```bash
git commit --no-verify -m "紧急修复"
```

## 最佳实践

1. **每次提交只做一件事**：一个提交应该只包含一个逻辑变更
2. **提交前检查**：使用 `git diff` 查看变更
3. **使用描述性的提交消息**：让他人能够理解你的变更
4. **及时提交**：完成一个小功能就提交，不要积累大量变更
5. **遵循规范**：保持团队提交风格一致

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular 提交规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [commitlint 文档](https://commitlint.js.org/)

---

**最后更新**：2025-12-30

