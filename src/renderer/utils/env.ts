/**
 * 渲染进程环境变量工具
 * 从 import.meta.env 获取环境变量
 */

/**
 * 环境变量配置对象
 */
export const env = {
  // 应用配置
  appName: import.meta.env.VITE_APP_NAME || 'Template Electron',
  appVersion: import.meta.env.VITE_APP_VERSION || '0.0.1',

  // API 配置
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || '',
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // 开发环境配置
  devPort: Number(import.meta.env.VITE_DEV_PORT) || 5173,
  devHost: import.meta.env.VITE_DEV_HOST || 'localhost',

  // 功能开关
  enableDevTools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true' || import.meta.env.DEV,
  enableLog: import.meta.env.VITE_ENABLE_LOG !== 'false',

  // 模式
  mode: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
