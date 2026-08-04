import type { Request, Response, NextFunction } from 'express';
import DetalleVentaEntity from '../../database/entities/detalle-venta.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class DetalleVentaController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const detalles = await DetalleVentaEntity.findAll();

            res.status(200).json({
                message: 'Sale details retrieved successfully',
                data: detalles
            });
        } catch (error) {
            next(error);
        }
    }

    public static async readByVentaId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { ventaId } = req.params;

            if (!ventaId || typeof ventaId !== 'string') {
                throw new BadRequest('Invalid or missing sale ID');
            }

            const detalles = await DetalleVentaEntity.findByVentaId(ventaId);

            res.status(200).json({
                message: 'Sale details retrieved successfully',
                data: detalles
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

            const detalle = await DetalleVentaEntity.findById(id);

            if (!detalle) {
                throw new NotFound('Sale detail not found');
            }

            res.status(200).json({
                message: 'Sale detail retrieved successfully',
                data: detalle
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newDetalle = await DetalleVentaEntity.create(data);

            res.status(201).json({
                message: 'Sale detail created successfully',
                data: newDetalle
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

            const updatedDetalle = await DetalleVentaEntity.update(id, data);

            res.status(200).json({
                message: 'Sale detail modified successfully',
                data: updatedDetalle
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

            await DetalleVentaEntity.delete(id);

            res.status(200).json({
                message: 'Sale detail deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
