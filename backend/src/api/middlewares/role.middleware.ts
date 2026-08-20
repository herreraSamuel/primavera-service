import type { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.user?.rol;

        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({
                status: 'fail',
                message: 'Acceso denegado: No tienes los permisos necesarios',
            });
            return;
        }

        next();
    };
};
