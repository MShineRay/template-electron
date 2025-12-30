import { app, BrowserWindow } from 'electron';
import { WindowManager } from './modules/window-manager';
import { MenuManager } from './modules/menu-manager';
import { TrayManager } from './modules/tray-manager';
import { IpcManager } from './modules/ipc-manager';
import { ConfigManager } from './modules/config-manager';
import { Logger } from './modules/logger';

// 开发模式下启用热重载
if (process.env.NODE_ENV === 'development' || process.argv.includes('--dev')) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: false, // Vite 已经处理了渲染进程的 HMR
      ignore: [
        /node_modules/,
        /dist/,
        /\.git/,
      ],
    });
  } catch {
    // electron-reloader 可能在生产环境中不可用，忽略错误
    // 静默失败，不影响应用启动
  }
}

class Application {
  private windowManager: WindowManager;
  private menuManager: MenuManager;
  private trayManager: TrayManager;
  private ipcManager: IpcManager;
  private configManager: ConfigManager;
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
    this.configManager = new ConfigManager();
    this.windowManager = new WindowManager(this.logger, this.configManager);
    this.menuManager = new MenuManager(this.windowManager, this.logger);
    this.trayManager = new TrayManager(this.windowManager, this.logger);
    this.ipcManager = new IpcManager(this.windowManager, this.configManager, this.logger);
  }

  async initialize() {
    // 等待应用准备就绪
    await app.whenReady();

    // 创建主窗口
    this.windowManager.createMainWindow();

    // 初始化菜单
    this.menuManager.initialize();

    // 初始化系统托盘
    this.trayManager.initialize();

    // 初始化 IPC 通信
    this.ipcManager.initialize();

    // 应用事件监听
    this.setupAppEvents();
  }

  private setupAppEvents() {
    // 所有窗口关闭时（macOS 除外）
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // macOS 点击 dock 图标时重新创建窗口
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.windowManager.createMainWindow();
      }
    });

    // 应用退出前清理
    app.on('before-quit', () => {
      this.logger.info('应用正在退出...');
    });
  }
}

// 启动应用
const logger = new Logger();
const application = new Application();
application.initialize().catch((error) => {
  logger.error('应用启动失败:', error);
  process.exit(1);
});

