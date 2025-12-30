/**
 * 主进程环境变量工具
 * 使用 dotenv 加载环境变量
 */

import path from 'path';

import dotenv from 'dotenv';

// 在 app 可用之前，先尝试从项目根目录加载
const projectRoot = process.cwd();

// 先加载基础配置 .env（如果存在）
dotenv.config({
  path: path.resolve(projectRoot, '.env'),
});

// 再加载环境特定配置（会覆盖 .env 中的同名变量）
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({
  path: path.resolve(projectRoot, envFile),
  override: true, // 允许覆盖基础配置
});

/**
 * 获取环境变量
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * 获取必需的环境变量，如果不存在则抛出错误
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`必需的环境变量 ${key} 未设置`);
  }
  return value;
}

/**
 * 获取布尔值环境变量
 */
export function getBoolEnv(key: string, defaultValue = false): boolean {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * 获取数字环境变量
 */
export function getNumberEnv(key: string, defaultValue?: number): number | undefined {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 环境变量配置对象
 */
export const env = {
  // 应用配置
  appName: getEnv('VITE_APP_NAME', 'Template Electron'),
  appVersion: getEnv('VITE_APP_VERSION', '0.0.1'),

  // API 配置
  apiBaseURL: getEnv('VITE_API_BASE_URL', ''),
  apiTimeout: getNumberEnv('VITE_API_TIMEOUT', 30000),

  // 开发环境配置
  devPort: getNumberEnv('VITE_DEV_PORT', 5173),
  devHost: getEnv('VITE_DEV_HOST', 'localhost'),

  // 功能开关
  enableDevTools: getBoolEnv('VITE_ENABLE_DEVTOOLS', process.env.NODE_ENV !== 'production'),
  enableLog: getBoolEnv('VITE_ENABLE_LOG', true),

  // Node 环境
  nodeEnv: getEnv('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};
