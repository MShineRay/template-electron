/**
 * API 接口封装示例
 * 根据实际后端 API 进行修改
 */

import { httpClient } from './http-client';

// API 响应类型定义
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户相关 API
export interface User {
  id: string;
  name: string;
  email: string;
}

export const userApi = {
  /**
   * 获取用户信息
   */
  getUser: (id: string) => {
    return httpClient.get<ApiResponse<User>>(`/api/users/${id}`);
  },

  /**
   * 获取用户列表
   */
  getUsers: (params?: { page?: number; pageSize?: number }) => {
    return httpClient.get<ApiResponse<User[]>>('/api/users', { params });
  },

  /**
   * 创建用户
   */
  createUser: (data: Omit<User, 'id'>) => {
    return httpClient.post<ApiResponse<User>>('/api/users', data);
  },

  /**
   * 更新用户
   */
  updateUser: (id: string, data: Partial<User>) => {
    return httpClient.put<ApiResponse<User>>(`/api/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  deleteUser: (id: string) => {
    return httpClient.delete<ApiResponse<void>>(`/api/users/${id}`);
  },
};

// 示例：添加请求拦截器（添加 token）
httpClient.addRequestInterceptor((config) => {
  // 从配置或 localStorage 获取 token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// 示例：添加响应拦截器（统一处理响应）
httpClient.addResponseInterceptor((response) => {
  // 如果后端返回的是统一的 ApiResponse 格式，可以在这里统一处理
  // const apiResponse = response.data as ApiResponse;
  // if (apiResponse.code !== 200) {
  //   throw new Error(apiResponse.message);
  // }
  return response;
});

// 示例：添加错误拦截器（统一错误处理）
httpClient.addErrorInterceptor((error) => {
  // 可以在这里统一处理错误，比如显示错误提示
  console.error('API 请求失败:', error);
  // 可以调用 Electron 的对话框显示错误
  // window.electronAPI?.dialog?.showErrorBox?.('请求失败', error.message);
  throw error;
});

