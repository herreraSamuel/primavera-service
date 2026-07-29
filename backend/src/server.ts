import 'dotenv/config';
import express, { type Application } from 'express';
import appRouter from './api/routes/index.js';
import { errorHandler } from './api/middlewares/error.middleware.js';

class Server {
  private app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.app.use(express.json({ limit: '10mb' }));

    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }

  private routes(): void {
    this.app.use('/api', appRouter);
  }

  private errorHandling() {
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Backend initialized at http://localhost:${this.port}`);
    });
  }
}

new Server().listen();
