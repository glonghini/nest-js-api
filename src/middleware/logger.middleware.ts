import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, baseUrl, query, body } = req;
    const startTime = Date.now();

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime;
      this.logger.log(
        `${method} ${baseUrl} ${statusCode} - ${responseTime}ms`
      );
      if (Object.keys(query).length > 0) {
        this.logger.log(`Query Params: ${JSON.stringify(query)}`);
      }
      if (body && Object.keys(body).length > 0) {
        this.logger.log(`Body: ${JSON.stringify(body)}`);
      }
    });

    next();
  }
}
