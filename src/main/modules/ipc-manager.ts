import { ipcMain, BrowserWindow } from 'electron';
import { WindowManager } from './window-manager';
import { ConfigManager } from './config-manager';
import { Logger } from './logger';

export class IpcManager {
  private windowManager: WindowManager;
  private configManager: ConfigManager;
  private logger: Logger;

  constructor(
    windowManager: WindowManager,
    configManager: ConfigManager,
    logger: Logger
  ) {
    this.windowManager = windowManager;
    this.configManager = configManager;
    this.logger = logger;
  }

  initialize(): void {
    // 窗口控制
    this.registerWindowHandlers();

    // 配置管理
    this.registerConfigHandlers();

    // 应用信息
    this.registerAppHandlers();

    this.logger.info('IPC 通信已初始化');
  }

  private registerWindowHandlers(): void {
    // 最小化窗口
    ipcMain.handle('window:minimize', () => {
      this.windowManager.minimizeMainWindow();
    });

    // 最大化/还原窗口
    ipcMain.handle('window:maximize', () => {
      this.windowManager.maximizeMainWindow();
    });

    // 关闭窗口
    ipcMain.handle('window:close', () => {
      this.windowManager.closeMainWindow();
    });

    // 切换全屏
    ipcMain.handle('window:toggle-fullscreen', () => {
      this.windowManager.toggleFullscreen();
    });

    // 获取窗口状态
    ipcMain.handle('window:get-state', () => {
      const mainWindow = this.windowManager.getMainWindow();
      if (mainWindow) {
        return {
          isMaximized: mainWindow.isMaximized(),
          isFullScreen: mainWindow.isFullScreen(),
          isMinimized: mainWindow.isMinimized(),
        };
      }
      return null;
    });
  }

  private registerConfigHandlers(): void {
    // 获取配置
    ipcMain.handle('config:get', (_event, key: string) => {
      return this.configManager.get(key as any);
    });

    // 设置配置
    ipcMain.handle('config:set', (_event, key: string, value: any) => {
      this.configManager.set(key as any, value);
    });

    // 获取所有配置
    ipcMain.handle('config:get-all', () => {
      return this.configManager.getAll();
    });

    // 重置配置
    ipcMain.handle('config:reset', () => {
      this.configManager.reset();
    });
  }

  private registerAppHandlers(): void {
    // 获取应用版本
    ipcMain.handle('app:get-version', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { app } = require('electron');
      return app.getVersion();
    });

    // 获取应用名称
    ipcMain.handle('app:get-name', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { app } = require('electron');
      return app.getName();
    });
  }
}

