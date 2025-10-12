import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! My Var = ${process.env.MY_VAR}`;
  }
}
