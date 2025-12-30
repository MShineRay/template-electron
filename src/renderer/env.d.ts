/// <reference types="vite/client" />

/**
 * 环境变量类型定义
 * 在 .env 文件中定义的环境变量需要在这里声明类型
 */
interface ImportMetaEnv {
  // 应用配置
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // API 配置
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;

  // 开发环境配置
  readonly VITE_DEV_PORT?: string;
  readonly VITE_DEV_HOST?: string;

  // 功能开关
  readonly VITE_ENABLE_DEVTOOLS?: string;
  readonly VITE_ENABLE_LOG?: string;

  // 其他配置
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

