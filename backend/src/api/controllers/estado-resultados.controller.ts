import type { Request, Response, NextFunction } from 'express';
import EstadoResultadosEntity from '../../database/entities/estado-resultados.entity.js';
import { BadRequest } from '../errors/app.error.js';

export default class EstadoResultadosController {

    public static async getResumen(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { startDate, endDate, month, year, mes, anio } = req.query as {
                startDate?: string;
                endDate?: string;
                month?: string;
                year?: string;
                mes?: string;
                anio?: string;
            };

            const m = month || mes;
            const y = year || anio;

            if (m && y) {
                const monthNum = parseInt(m);
                const yearNum = parseInt(y);

                if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
                    throw new BadRequest('Invalid month or year parameter');
                }

                startDate = new Date(yearNum, monthNum - 1, 1).toISOString();
                endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999).toISOString();
            } else if (startDate && endDate) {
                if (!endDate.includes('T')) {
                    endDate = `${endDate}T23:59:59.999Z`;
                }
                if (!startDate.includes('T')) {
                    startDate = `${startDate}T00:00:00.000Z`;
                }
            } else {
                const now = new Date();
                startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
            }

            const resumen = await EstadoResultadosEntity.getResumen(startDate, endDate);

            res.status(200).json({
                message: 'Income statement retrieved successfully',
                data: resumen
            });
        } catch (error) {
            next(error);
        }
    }
}
