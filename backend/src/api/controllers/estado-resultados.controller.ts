import type { Request, Response, NextFunction } from 'express';
import EstadoResultadosEntity from '../../database/entities/estado-resultados.entity.js';
import { BadRequest } from '../errors/app.error.js';

export default class EstadoResultadosController {

    public static async getResumen(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const monthStr = req.query.month as string;
            const yearStr = req.query.year as string;

            if (!monthStr || !yearStr) {
                throw new BadRequest('Month and year parameters are required');
            }

            const month = parseInt(monthStr);
            const year = parseInt(yearStr);

            if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
                throw new BadRequest('Invalid month or year parameter');
            }

            const resumen = await EstadoResultadosEntity.getResumen(month, year);

            res.status(200).json({
                message: 'Income statement retrieved successfully',
                data: resumen
            });
        } catch (error) {
            next(error);
        }
    }
}
