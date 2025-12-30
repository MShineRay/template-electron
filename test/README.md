# 测试文档

本目录包含项目的测试文件。

## 测试框架

项目使用 **Vitest** 作为测试框架，具有以下优势：

- 与 Vite 完美集成
- 快速执行
- 支持 TypeScript
- 兼容 Jest API

## 目录结构

```
test/
├── unit/              # 单元测试
│   ├── main/         # 主进程模块测试
│   └── renderer/     # 渲染进程测试
├── integration/      # 集成测试
└── e2e/              # 端到端测试
```

## 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test:watch

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

## 编写测试

### 单元测试示例

```typescript
import { describe, it, expect } from 'vitest';
import { ConfigManager } from '../../src/main/modules/config-manager';

describe('ConfigManager', () => {
  it('should get default config', () => {
    const config = new ConfigManager();
    const theme = config.get('theme');
    expect(theme).toBe('auto');
  });
});
```

## 测试覆盖率

目标覆盖率：

- 语句覆盖率：> 80%
- 分支覆盖率：> 75%
- 函数覆盖率：> 80%
- 行覆盖率：> 80%
