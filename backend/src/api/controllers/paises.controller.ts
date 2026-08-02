import type { Request, Response, NextFunction } from 'express';
import PaisesEntity from '../../database/entities/paises.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class PaisesController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const paises = await PaisesEntity.findAll();

            res.status(200).json({
                message: 'Countries retrieved successfully',
                data: paises
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

            const pais = await PaisesEntity.findById(Number(id));

            if (!pais) {
                throw new NotFound('Country not found');
            }

            res.status(200).json({
                message: 'Country retrieved successfully',
                data: pais
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newPais = await PaisesEntity.create(data);

            res.status(201).json({
                message: 'Country created successfully',
                data: newPais
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

            const updatedPais = await PaisesEntity.update(Number(id), data);

            res.status(200).json({
                message: 'Country modified successfully',
                data: updatedPais
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

            await PaisesEntity.delete(Number(id));

            res.status(200).json({
                message: 'Country deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
