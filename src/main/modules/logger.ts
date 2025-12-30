import log from 'electron-log';
import path from 'path';
import { app } from 'electron';

export class Logger {
  constructor() {
    // 配置日志文件路径
    log.transports.file.level = 'info';
    log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}][{level}]{text}';
    
    // 控制台输出
    log.transports.console.level = 'debug';
    
    // 在开发环境下，日志也输出到控制台
    if (!app.isPackaged) {
      log.transports.console.format = '[{h}:{i}:{s}.{ms}][{level}]{text}';
    }
  }

  info(message: string, ...args: any[]) {
    log.info(message, ...args);
  }

  error(message: string, ...args: any[]) {
    log.error(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    log.warn(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    log.debug(message, ...args);
  }
}

