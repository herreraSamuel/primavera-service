import { type Request, type Response, type NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodTypeAny) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));

                res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed for incoming request data',
                    errors: formattedErrors,
                });
                return;
            }

            next(error);
        }
    };
};