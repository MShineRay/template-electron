import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import { WindowManager } from './window-manager';
import { Logger } from './logger';

export class TrayManager {
  private tray: Tray | null = null;
  private windowManager: WindowManager;
  private logger: Logger;

  constructor(windowManager: WindowManager, logger: Logger) {
    this.windowManager = windowManager;
    this.logger = logger;
  }

  initialize(): void {
    // 创建托盘图标
    const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
    let icon = nativeImage.createFromPath(iconPath);

    // 如果图标不存在，创建一个空图标
    if (icon.isEmpty()) {
      icon = nativeImage.createEmpty();
    }

    // 设置托盘图标大小（macOS 需要 22x22，Windows/Linux 需要 16x16）
    const size = process.platform === 'darwin' ? 22 : 16;
    icon = icon.resize({ width: size, height: size });

    this.tray = new Tray(icon);

    // 设置托盘提示
    this.tray.setToolTip(app.getName());

    // 创建上下文菜单
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示窗口',
        click: () => {
          const mainWindow = this.windowManager.getMainWindow();
          if (mainWindow) {
            if (mainWindow.isMinimized()) {
              mainWindow.restore();
            }
            mainWindow.show();
            mainWindow.focus();
          } else {
            this.windowManager.createMainWindow();
          }
        },
      },
      {
        label: '隐藏窗口',
        click: () => {
          const mainWindow = this.windowManager.getMainWindow();
          if (mainWindow) {
            mainWindow.hide();
          }
        },
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);

    // 点击托盘图标（macOS 需要双击）
    if (process.platform === 'darwin') {
      this.tray.on('double-click', () => {
        const mainWindow = this.windowManager.getMainWindow();
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.hide();
          } else {
            mainWindow.show();
            mainWindow.focus();
          }
        } else {
          this.windowManager.createMainWindow();
        }
      });
    } else {
      this.tray.on('click', () => {
        const mainWindow = this.windowManager.getMainWindow();
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.hide();
          } else {
            mainWindow.show();
            mainWindow.focus();
          }
        } else {
          this.windowManager.createMainWindow();
        }
      });
    }

    this.logger.info('系统托盘已初始化');
  }

  destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
      this.logger.info('系统托盘已销毁');
    }
  }
}

