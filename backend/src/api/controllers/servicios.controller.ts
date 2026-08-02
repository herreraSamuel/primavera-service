import type { Request, Response, NextFunction } from 'express';
import ServiciosEntity from '../../database/entities/servicios.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class ServiciosController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const servicios = await ServiciosEntity.findAll();

            res.status(200).json({
                message: 'Services retrieved successfully',
                data: servicios
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

            const servicio = await ServiciosEntity.findById(Number(id));

            if (!servicio) {
                throw new NotFound('Service not found');
            }

            res.status(200).json({
                message: 'Service retrieved successfully',
                data: servicio
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newServicio = await ServiciosEntity.create(data);

            res.status(201).json({
                message: 'Service created successfully',
                data: newServicio
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

            const updatedServicio = await ServiciosEntity.update(Number(id), data);

            res.status(200).json({
                message: 'Service modified successfully',
                data: updatedServicio
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

            await ServiciosEntity.delete(Number(id));

            res.status(200).json({
                message: 'Service deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
