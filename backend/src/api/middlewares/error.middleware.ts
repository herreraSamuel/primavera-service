import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/client.errors.js';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ ok: false, error: err.message });
        return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': {
                const target = (err.meta?.target as string[]) || ['field'];
                res.status(409).json({
                    ok: false,
                    error: `A record with this ${target.join(', ')} already exists.`,
                });
                return;
            }

            case 'P2003': {
                res.status(400).json({
                    ok: false,
                    error: 'Invalid reference: The specified related entity does not exist.',
                });
                return;
            }

            case 'P2025': {
                res.status(404).json({
                    ok: false,
                    error: 'The requested record was not found.',
                });
                return;
            }

            default: {
                res.status(400).json({
                    ok: false,
                    error: `Database error (${err.code})`,
                });
                return;
            }
        }
    }

    console.error('Unexpected error:', err);
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
};