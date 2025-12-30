import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { Logger } from './logger';
import { ConfigManager } from './config-manager';
import { env } from '../utils/env';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private logger: Logger;
  private configManager?: ConfigManager;

  constructor(logger: Logger, configManager?: ConfigManager) {
    this.logger = logger;
    this.configManager = configManager;
  }

  createMainWindow(): BrowserWindow {
    if (this.mainWindow) {
      this.mainWindow.focus();
      return this.mainWindow;
    }

    const config = this.configManager?.get('window') || {
      width: 1200,
      height: 800,
    };

    // 获取主显示器的工作区域
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    // 计算窗口位置（居中）
    const x = Math.floor((screenWidth - config.width) / 2);
    const y = Math.floor((screenHeight - config.height) / 2);

    this.mainWindow = new BrowserWindow({
      width: config.width,
      height: config.height,
      x: config.x ?? x,
      y: config.y ?? y,
      minWidth: 800,
      minHeight: 600,
      show: false, // 先不显示，等加载完成后再显示
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
      webPreferences: {
        preload: path.join(__dirname, '../preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
      },
    });

    // 加载页面
    const isDev = env.isDevelopment || process.argv.includes('--dev');
    
    if (isDev) {
      // 开发模式：加载 Vite 开发服务器
      const devURL = `http://${env.devHost}:${env.devPort}`;
      this.mainWindow.loadURL(devURL).catch((error: Error) => {
        this.logger.error('加载开发服务器失败:', error);
        // 如果开发服务器还没启动，显示错误页面
        this.mainWindow?.loadURL('data:text/html,<h1>开发服务器未启动</h1><p>请先运行 <code>pnpm run dev</code></p>');
      });
      // 根据环境变量决定是否打开 DevTools
      if (env.enableDevTools) {
        this.mainWindow.webContents.openDevTools();
      }
      
      // 开发模式下，监听 Vite HMR 更新
      this.mainWindow.webContents.on('did-fail-load', () => {
        // 如果加载失败，等待一段时间后重试
        setTimeout(() => {
          if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.reload();
          }
        }, 1000);
      });
    } else {
      // 生产模式：加载构建后的文件
      const htmlPath = path.join(__dirname, '../renderer/index.html');
      // loadFile 会自动处理 UTF-8 编码
      this.mainWindow.loadFile(htmlPath).catch((error: Error) => {
        this.logger.error('加载 HTML 文件失败:', error);
      });
    }

    // 窗口显示时触发
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
      if (config.maximized) {
        this.mainWindow?.maximize();
      }
      this.logger.info('主窗口已创建并显示');
    });

    // 窗口关闭事件
    this.mainWindow.on('close', () => {
      if (this.configManager && this.mainWindow) {
        // 保存窗口状态
        const bounds = this.mainWindow.getBounds();
        this.configManager.set('window', {
          width: bounds.width,
          height: bounds.height,
          x: bounds.x,
          y: bounds.y,
          maximized: this.mainWindow.isMaximized(),
        });
      }
    });

    // 窗口关闭后清理引用
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
      this.logger.info('主窗口已关闭');
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  closeMainWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }

  minimizeMainWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.minimize();
    }
  }

  maximizeMainWindow(): void {
    if (this.mainWindow) {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow.maximize();
      }
    }
  }

  toggleFullscreen(): void {
    if (this.mainWindow) {
      this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
    }
  }
}

