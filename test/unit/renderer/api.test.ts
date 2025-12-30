import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟 electronAPI
const mockElectronAPI = {
  window: {
    minimize: vi.fn().mockResolvedValue(undefined),
    maximize: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    toggleFullscreen: vi.fn().mockResolvedValue(undefined),
    getState: vi.fn().mockResolvedValue({
      isMaximized: false,
      isFullScreen: false,
      isMinimized: false,
    }),
  },
  config: {
    get: vi.fn().mockResolvedValue('auto'),
    set: vi.fn().mockResolvedValue(undefined),
    getAll: vi.fn().mockResolvedValue({ theme: 'auto', language: 'zh-CN' }),
    reset: vi.fn().mockResolvedValue(undefined),
  },
  app: {
    getVersion: vi.fn().mockResolvedValue('1.0.0'),
    getName: vi.fn().mockResolvedValue('Template Electron'),
  },
};

// 模拟全局 window.electronAPI
global.window = {
  electronAPI: mockElectronAPI,
} as any;

describe('Electron API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // consoleSpy 用于未来扩展，暂时保留
  const _consoleSpy = {
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
  };
  // 避免未使用变量警告
  void _consoleSpy;

  describe('Window API', () => {
    it('should minimize window', async () => {
      await window.electronAPI.window.minimize();
      expect(mockElectronAPI.window.minimize).toHaveBeenCalled();
    });

    it('should maximize window', async () => {
      await window.electronAPI.window.maximize();
      expect(mockElectronAPI.window.maximize).toHaveBeenCalled();
    });

    it('should close window', async () => {
      await window.electronAPI.window.close();
      expect(mockElectronAPI.window.close).toHaveBeenCalled();
    });

    it('should toggle fullscreen', async () => {
      await window.electronAPI.window.toggleFullscreen();
      expect(mockElectronAPI.window.toggleFullscreen).toHaveBeenCalled();
    });

    it('should get window state', async () => {
      const state = await window.electronAPI.window.getState();
      expect(mockElectronAPI.window.getState).toHaveBeenCalled();
      expect(state).toHaveProperty('isMaximized');
      expect(state).toHaveProperty('isFullScreen');
      expect(state).toHaveProperty('isMinimized');
    });
  });

  describe('Config API', () => {
    it('should get config', async () => {
      const theme = await window.electronAPI.config.get('theme');
      expect(mockElectronAPI.config.get).toHaveBeenCalledWith('theme');
      expect(theme).toBe('auto');
    });

    it('should set config', async () => {
      await window.electronAPI.config.set('theme', 'dark');
      expect(mockElectronAPI.config.set).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should get all config', async () => {
      const allConfig = await window.electronAPI.config.getAll();
      expect(mockElectronAPI.config.getAll).toHaveBeenCalled();
      expect(allConfig).toHaveProperty('theme');
    });

    it('should reset config', async () => {
      await window.electronAPI.config.reset();
      expect(mockElectronAPI.config.reset).toHaveBeenCalled();
    });
  });

  describe('App API', () => {
    it('should get app version', async () => {
      const version = await window.electronAPI.app.getVersion();
      expect(mockElectronAPI.app.getVersion).toHaveBeenCalled();
      expect(version).toBe('1.0.0');
    });

    it('should get app name', async () => {
      const name = await window.electronAPI.app.getName();
      expect(mockElectronAPI.app.getName).toHaveBeenCalled();
      expect(name).toBe('Template Electron');
    });
  });
});
