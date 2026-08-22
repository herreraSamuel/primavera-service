import type { Request, Response, NextFunction } from 'express';
import GastoEntity from '../../database/entities/gasto.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class GastoController {
    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const gastos = await GastoEntity.findAll(page, limit, search);

            res.status(200).json({
                message: 'Expenses retrieved successfully',
                data: gastos
            });
        } catch (error) {
            next(error);
        }
    }

    public static async readById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                throw new BadRequest('Invalid or missing ID');
            }

            const gasto = await GastoEntity.findById(id);

            if (!gasto) {
                throw new NotFound('Expense not found');
            }

            res.status(200).json({
                message: 'Expense retrieved successfully',
                data: gasto
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const newGasto = await GastoEntity.create(data);

            res.status(201).json({
                message: 'Expense created successfully',
                data: newGasto
            });
        } catch (error) {
            next(error);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                throw new BadRequest('Invalid or missing ID');
            }

            const data = req.body;
            const updatedGasto = await GastoEntity.update(id, data);

            res.status(200).json({
                message: 'Expense updated successfully',
                data: updatedGasto
            });
        } catch (error) {
            next(error);
        }
    }

    public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                throw new BadRequest('Invalid or missing ID');
            }

            await GastoEntity.delete(id);

            res.status(200).json({
                message: 'Expense deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    public static async getMonthlySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
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

            const summary = await GastoEntity.getSummary(startDate, endDate);

            res.status(200).json({
                message: 'Expense summary retrieved successfully',
                data: summary
            });
        } catch (error) {
            next(error);
        }
    }
}
