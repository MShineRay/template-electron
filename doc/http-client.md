# HTTP 客户端使用指南

本文档介绍如何使用项目中的 HTTP 客户端工具。

## 概述

项目提供了两个 HTTP 客户端实现：

- **主进程 HTTP 客户端** (`src/main/modules/http-client.ts`) - 在主进程中使用
- **渲染进程 HTTP 客户端** (`src/renderer/utils/http-client.ts`) - 在渲染进程中使用

两个客户端功能相同，都支持：

- ✅ 请求/响应拦截器
- ✅ 错误处理
- ✅ 超时控制
- ✅ TypeScript 类型支持
- ✅ 自动 JSON 解析
- ✅ URL 参数处理

## 渲染进程使用

### 基础使用

```typescript
import { httpClient } from './utils/http-client';

// GET 请求
const response = await httpClient.get('/api/users');
console.log(response.data);

// POST 请求
const createResponse = await httpClient.post('/api/users', {
  name: 'John',
  email: 'john@example.com',
});

// 带参数请求
const users = await httpClient.get('/api/users', {
  params: { page: 1, pageSize: 10 },
});
```

### 使用 API 封装

项目已提供 API 封装示例 (`src/renderer/utils/api.ts`)：

```typescript
import { userApi } from './utils/api';

// 获取用户列表
const response = await userApi.getUsers({ page: 1, pageSize: 10 });
console.log(response.data.data); // 用户列表

// 创建用户
const newUser = await userApi.createUser({
  name: 'John',
  email: 'john@example.com',
});
```

### 配置拦截器

```typescript
import { httpClient } from './utils/http-client';

// 请求拦截器 - 添加 token
httpClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 响应拦截器 - 统一处理响应
httpClient.addResponseInterceptor((response) => {
  // 可以在这里统一处理响应格式
  return response;
});

// 错误拦截器 - 统一错误处理
httpClient.addErrorInterceptor((error) => {
  console.error('请求失败:', error);
  // 可以显示错误提示
  throw error;
});
```

### 创建自定义客户端实例

```typescript
import { HttpClient } from './utils/http-client';

const customClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## 主进程使用

### 基础使用

```typescript
import { HttpClient } from './modules/http-client';
import { Logger } from './modules/logger';

const logger = new Logger();
const httpClient = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  logger, // 可选，用于日志记录
});

// GET 请求
const response = await httpClient.get('/api/data');
logger.info('响应数据:', response.data);
```

## API 方法

### GET 请求

```typescript
httpClient.get<T>(url: string, config?: RequestConfig): Promise<Response<T>>
```

### POST 请求

```typescript
httpClient.post<T>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
```

### PUT 请求

```typescript
httpClient.put<T>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
```

### DELETE 请求

```typescript
httpClient.delete<T>(url: string, config?: RequestConfig): Promise<Response<T>>
```

### PATCH 请求

```typescript
httpClient.patch<T>(url: string, data?: any, config?: RequestConfig): Promise<Response<T>>
```

## 请求配置

```typescript
interface RequestConfig {
  url: string; // 请求 URL
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>; // 请求头
  params?: Record<string, any>; // URL 参数
  data?: any; // 请求体
  timeout?: number; // 超时时间（毫秒）
}
```

## 响应格式

```typescript
interface Response<T> {
  data: T; // 响应数据
  status: number; // HTTP 状态码
  statusText: string; // 状态文本
  headers: Record<string, string>; // 响应头
}
```

## 错误处理

```typescript
try {
  const response = await httpClient.get('/api/data');
  console.log(response.data);
} catch (error) {
  if (error instanceof Error) {
    console.error('请求失败:', error.message);
    // 可以通过 error.response 访问响应数据
    if ((error as any).response) {
      console.error('响应状态:', (error as any).response.status);
    }
  }
}
```

## 环境变量配置

在渲染进程中，可以通过环境变量配置 API 基础 URL：

```bash
# .env
VITE_API_BASE_URL=https://api.example.com
```

HTTP 客户端会自动读取 `VITE_API_BASE_URL` 环境变量。

## 最佳实践

1. **使用 API 封装**：将 API 调用封装到独立的文件中，便于管理和维护
2. **类型定义**：为 API 响应定义 TypeScript 类型，获得类型安全
3. **统一错误处理**：使用错误拦截器统一处理错误
4. **请求拦截器**：使用请求拦截器添加认证信息、设置通用请求头
5. **响应拦截器**：使用响应拦截器统一处理响应格式

## 示例：完整的 API 封装

```typescript
// src/renderer/utils/api.ts
import { httpClient } from './http-client';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const userApi = {
  getUser: (id: string) =>
    httpClient.get<ApiResponse<User>>(`/api/users/${id}`),

  getUsers: (params?: { page?: number }) =>
    httpClient.get<ApiResponse<User[]>>('/api/users', { params }),

  createUser: (data: Omit<User, 'id'>) =>
    httpClient.post<ApiResponse<User>>('/api/users', data),
};
```
