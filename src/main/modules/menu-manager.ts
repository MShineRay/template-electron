import { Menu, MenuItem, app, shell, dialog, MenuItemConstructorOptions } from 'electron';

import { Logger } from './logger';
import { WindowManager } from './window-manager';

export class MenuManager {
  private windowManager: WindowManager;
  private logger: Logger;

  constructor(windowManager: WindowManager, logger: Logger) {
    this.windowManager = windowManager;
    this.logger = logger;
  }

  initialize(): void {
    const template = this.createMenuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    this.logger.info('应用菜单已初始化');
  }

  private createMenuTemplate(): (MenuItemConstructorOptions | MenuItem)[] {
    const isMac = process.platform === 'darwin';

    const template: (MenuItemConstructorOptions | MenuItem)[] = [
      // macOS 应用菜单
      ...(isMac
        ? [
            {
              label: app.getName(),
              submenu: [
                { role: 'about' as const, label: '关于' },
                { type: 'separator' as const },
                { role: 'services' as const, label: '服务' },
                { type: 'separator' as const },
                { role: 'hide' as const, label: '隐藏' },
                { role: 'hideOthers' as const, label: '隐藏其他' },
                { role: 'unhide' as const, label: '显示全部' },
                { type: 'separator' as const },
                { role: 'quit' as const, label: '退出' },
              ] as MenuItemConstructorOptions[],
            },
          ]
        : []),
      // 文件菜单
      {
        label: '文件',
        submenu: [
          {
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              this.logger.info('新建文件');
              // 实现新建文件逻辑
            },
          },
          {
            label: '打开',
            accelerator: 'CmdOrCtrl+O',
            click: async () => {
              const result = await dialog.showOpenDialog({
                properties: ['openFile'],
                filters: [{ name: '所有文件', extensions: ['*'] }],
              });
              if (!result.canceled && result.filePaths.length > 0) {
                this.logger.info('打开文件:', result.filePaths[0]);
                // 实现打开文件逻辑
              }
            },
          },
          { type: 'separator' as const },
          {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              this.logger.info('保存文件');
              // 实现保存文件逻辑
            },
          },
          {
            label: '另存为',
            accelerator: 'CmdOrCtrl+Shift+S',
            click: async () => {
              const result = await dialog.showSaveDialog({
                filters: [{ name: '所有文件', extensions: ['*'] }],
              });
              if (!result.canceled && result.filePath) {
                this.logger.info('另存为:', result.filePath);
                // 实现另存为逻辑
              }
            },
          },
          { type: 'separator' as const },
          ...(isMac
            ? []
            : [
                {
                  role: 'quit' as const,
                  label: '退出',
                },
              ]),
        ] as MenuItemConstructorOptions[],
      },
      // 编辑菜单
      {
        label: '编辑',
        submenu: [
          { role: 'undo' as const, label: '撤销' },
          { role: 'redo' as const, label: '重做' },
          { type: 'separator' as const },
          { role: 'cut' as const, label: '剪切' },
          { role: 'copy' as const, label: '复制' },
          { role: 'paste' as const, label: '粘贴' },
          { role: 'selectAll' as const, label: '全选' },
        ] as MenuItemConstructorOptions[],
      },
      // 视图菜单
      {
        label: '视图',
        submenu: [
          { role: 'reload' as const, label: '重新加载' },
          { role: 'forceReload' as const, label: '强制重新加载' },
          { role: 'toggleDevTools' as const, label: '开发者工具' },
          { type: 'separator' as const },
          { role: 'resetZoom' as const, label: '实际大小' },
          { role: 'zoomIn' as const, label: '放大' },
          { role: 'zoomOut' as const, label: '缩小' },
          { type: 'separator' as const },
          { role: 'togglefullscreen' as const, label: '全屏' },
        ] as MenuItemConstructorOptions[],
      },
      // 窗口菜单
      {
        label: '窗口',
        submenu: [
          { role: 'minimize' as const, label: '最小化' },
          { role: 'close' as const, label: '关闭' },
          ...(isMac
            ? [{ type: 'separator' as const }, { role: 'front' as const, label: '前置全部窗口' }]
            : []),
        ] as MenuItemConstructorOptions[],
      },
      // 帮助菜单
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            click: () => {
              dialog.showMessageBox({
                type: 'info',
                title: '关于',
                message: app.getName(),
                detail: `版本: ${app.getVersion()}`,
              });
            },
          },
          {
            label: '学习更多',
            click: () => {
              shell.openExternal('https://www.electronjs.org');
            },
          },
        ] as MenuItemConstructorOptions[],
      },
    ];

    return template;
  }
}
