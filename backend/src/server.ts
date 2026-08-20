import 'dotenv/config';
import express, { type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
    this.app.use(helmet());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.',
    });
    this.app.use(limiter);

    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true,
    }));
    this.app.use(cookieParser());
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
