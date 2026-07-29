import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/client.errors.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ ok: false, error: err.message });
        return;
    }

    console.error("Unexpected error:", err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
};