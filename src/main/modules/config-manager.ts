import Store from 'electron-store';

import { Logger } from './logger';

export interface AppConfig {
  window: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    maximized?: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
  [key: string]: any;
}

export class ConfigManager {
  private store: Store<AppConfig>;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.store = new Store<AppConfig>({
      name: 'config',
      defaults: {
        window: {
          width: 1200,
          height: 800,
          maximized: false,
        },
        theme: 'auto',
        language: 'zh-CN',
      },
    });
  }

  get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.store.get(key);
  }

  set<T extends keyof AppConfig>(key: T, value: AppConfig[T]): void {
    this.store.set(key, value);
    this.logger.debug(`配置已更新: ${String(key)}`, value);
  }

  getAll(): AppConfig {
    return this.store.store;
  }

  reset(): void {
    this.store.clear();
    this.logger.info('配置已重置为默认值');
  }

  has(key: keyof AppConfig): boolean {
    return this.store.has(key);
  }

  delete(key: keyof AppConfig): void {
    this.store.delete(key);
    this.logger.debug(`配置已删除: ${String(key)}`);
  }
}
