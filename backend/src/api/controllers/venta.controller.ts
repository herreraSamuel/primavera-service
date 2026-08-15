import type { Request, Response, NextFunction } from 'express';
import VentaEntity from '../../database/entities/venta.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class VentaController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const ventas = await VentaEntity.findAll(page, limit, search);

            res.status(200).json({
                message: 'Sales retrieved successfully',
                data: ventas
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

            const venta = await VentaEntity.findById(id);

            if (!venta) {
                throw new NotFound('Sale not found');
            }

            res.status(200).json({
                message: 'Sale retrieved successfully',
                data: venta
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newVenta = await VentaEntity.create(data);

            res.status(201).json({
                message: 'Sale created successfully',
                data: newVenta
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

            const updatedVenta = await VentaEntity.update(id, data);

            res.status(200).json({
                message: 'Sale modified successfully',
                data: updatedVenta
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

            await VentaEntity.delete(id);

            res.status(200).json({
                message: 'Sale deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
    public static async estadisticas(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { startDate, endDate, mes, anio } = req.query as {
                startDate?: string;
                endDate?: string;
                mes?: string;
                anio?: string;
            };

            if (mes && anio) {
                const month = parseInt(mes);
                const year = parseInt(anio);

                if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
                    throw new BadRequest('Invalid mes or anio parameter');
                }

                startDate = new Date(year, month - 1, 1).toISOString();
                endDate = new Date(year, month, 0).toISOString();
            }

            const estadisticas = await VentaEntity.getEstadisticas(startDate, endDate);

            res.status(200).json({
                message: 'Statistics retrieved successfully',
                data: estadisticas
            });
        } catch (error) {
            next(error);
        }
    }
}
