import type { Request, Response, NextFunction } from 'express';
import AerolineasEntity from '../../database/entities/aerolineas.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class AerolineasController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const aerolineas = await AerolineasEntity.findAll();

            res.status(200).json({
                message: 'Airlines retrieved successfully',
                data: aerolineas
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

            const aerolinea = await AerolineasEntity.findById(Number(id));

            if (!aerolinea) {
                throw new NotFound('Airline not found');
            }

            res.status(200).json({
                message: 'Airline retrieved successfully',
                data: aerolinea
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newAerolinea = await AerolineasEntity.create(data);

            res.status(201).json({
                message: 'Airline created successfully',
                data: newAerolinea
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

            const updatedAerolinea = await AerolineasEntity.update(Number(id), data);

            res.status(200).json({
                message: 'Airline modified successfully',
                data: updatedAerolinea
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

            await AerolineasEntity.delete(Number(id));

            res.status(200).json({
                message: 'Airline deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
