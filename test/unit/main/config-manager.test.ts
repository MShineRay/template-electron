import { describe, it, expect, beforeEach } from 'vitest';

import { ConfigManager } from '../../../src/main/modules/config-manager';

describe('ConfigManager', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    configManager = new ConfigManager();
    // 清理配置
    configManager.reset();
  });

  it('should have default config', () => {
    const config = configManager.getAll();
    expect(config).toHaveProperty('window');
    expect(config).toHaveProperty('theme');
    expect(config).toHaveProperty('language');
  });

  it('should get config value', () => {
    const theme = configManager.get('theme');
    expect(theme).toBe('auto');
  });

  it('should set config value', () => {
    configManager.set('theme', 'dark');
    const theme = configManager.get('theme');
    expect(theme).toBe('dark');
  });

  it('should get all config', () => {
    const allConfig = configManager.getAll();
    expect(allConfig).toBeDefined();
    expect(typeof allConfig).toBe('object');
  });

  it('should reset config', () => {
    configManager.set('theme', 'dark');
    configManager.reset();
    const theme = configManager.get('theme');
    expect(theme).toBe('auto');
  });

  it('should check if config exists', () => {
    expect(configManager.has('theme')).toBe(true);
    expect(configManager.has('nonExistent')).toBe(false);
  });

  it('should delete config', () => {
    configManager.set('customKey', 'customValue');
    expect(configManager.has('customKey')).toBe(true);
    configManager.delete('customKey');
    expect(configManager.has('customKey')).toBe(false);
  });
});
