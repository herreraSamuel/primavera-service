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

            const summary = await GastoEntity.getMonthlySummary(month, year);

            res.status(200).json({
                message: 'Monthly expense summary retrieved successfully',
                data: summary
            });
        } catch (error) {
            next(error);
        }
    }
}
