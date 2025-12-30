/**
 * Vitest 测试环境设置
 * 用于 mock Electron 模块
 */

import { vi } from 'vitest';

// Mock Electron app 对象
vi.mock('electron', () => {
  return {
    app: {
      isPackaged: false,
      getName: vi.fn(() => 'Template Electron'),
      getVersion: vi.fn(() => '0.0.1'),
      getPath: vi.fn((name: string) => `/mock/path/${name}`),
      whenReady: vi.fn(() => Promise.resolve()),
      quit: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
    },
    BrowserWindow: vi.fn(),
    Menu: {
      buildFromTemplate: vi.fn(),
      setApplicationMenu: vi.fn(),
    },
    Tray: vi.fn(),
    ipcMain: {
      handle: vi.fn(),
      on: vi.fn(),
    },
    ipcRenderer: {
      invoke: vi.fn(),
      on: vi.fn(),
    },
    contextBridge: {
      exposeInMainWorld: vi.fn(),
    },
    dialog: {
      showOpenDialog: vi.fn(),
      showSaveDialog: vi.fn(),
      showMessageBox: vi.fn(),
    },
    shell: {
      openExternal: vi.fn(),
    },
    screen: {
      getPrimaryDisplay: vi.fn(() => ({
        workAreaSize: {
          width: 1920,
          height: 1080,
        },
      })),
    },
  };
});

// Mock electron-log
vi.mock('electron-log', () => {
  return {
    default: {
      transports: {
        file: {
          level: 'info',
          maxSize: 5 * 1024 * 1024,
          format: '',
        },
        console: {
          level: 'debug',
          format: '',
        },
      },
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    },
  };
});

// Mock electron-store
vi.mock('electron-store', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      const store: Record<string, any> = {
        window: {
          width: 1200,
          height: 800,
          maximized: false,
        },
        theme: 'auto',
        language: 'zh-CN',
      };

      return {
        get: vi.fn((key: string) => store[key]),
        set: vi.fn((key: string, value: any) => {
          store[key] = value;
        }),
        delete: vi.fn((key: string) => {
          delete store[key];
        }),
        has: vi.fn((key: string) => key in store),
        clear: vi.fn(() => {
          Object.keys(store).forEach((key) => delete store[key]);
          // 恢复默认值
          store.window = {
            width: 1200,
            height: 800,
            maximized: false,
          };
          store.theme = 'auto';
          store.language = 'zh-CN';
        }),
        store,
      };
    }),
  };
});

