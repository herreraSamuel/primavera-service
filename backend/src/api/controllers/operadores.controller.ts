import type { Request, Response, NextFunction } from 'express';
import OperadoresEntity from '../../database/entities/operadores.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class OperadoresController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const operadores = await OperadoresEntity.findAll();

            res.status(200).json({
                message: 'Operators retrieved successfully',
                data: operadores
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

            const operador = await OperadoresEntity.findById(Number(id));

            if (!operador) {
                throw new NotFound('Operator not found');
            }

            res.status(200).json({
                message: 'Operator retrieved successfully',
                data: operador
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newOperador = await OperadoresEntity.create(data);

            res.status(201).json({
                message: 'Operator created successfully',
                data: newOperador
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

            const updatedOperador = await OperadoresEntity.update(Number(id), data);

            res.status(200).json({
                message: 'Operator modified successfully',
                data: updatedOperador
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

            await OperadoresEntity.delete(Number(id));

            res.status(200).json({
                message: 'Operator deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}
