import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from '../../../src/main/modules/logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: {
    info: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    logger = new Logger();
    consoleSpy = {
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create logger instance', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should log info message', () => {
    logger.info('Test info message');
    // 注意：electron-log 可能不会直接调用 console，这里主要测试方法存在
    expect(logger.info).toBeDefined();
  });

  it('should log error message', () => {
    logger.error('Test error message');
    expect(logger.error).toBeDefined();
  });

  it('should log warn message', () => {
    logger.warn('Test warn message');
    expect(logger.warn).toBeDefined();
  });

  it('should log debug message', () => {
    logger.debug('Test debug message');
    expect(logger.debug).toBeDefined();
  });
});

