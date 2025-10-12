import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as fs from 'fs';
import * as path from 'path';

const logDir = path.join(process.cwd(), 'nestjs-logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
  ),
  transports: [
    transport,
    new winston.transports.Console(),
  ],
});

export class WinstonLogger implements LoggerService {
  log(message: string) {
    logger.info(message);
  }
  error(message: string, trace?: string) {
    logger.error(`${message}${trace ? ' - ' + trace : ''}`);
  }
  warn(message: string) {
    logger.warn(message);
  }
  debug?(message: string) {
    logger.debug(message);
  }
  verbose?(message: string) {
    logger.verbose(message);
  }
}
