import type { Request, Response, NextFunction } from 'express';
import DepartamentoEntity from '../../database/entities/departamento.entity.js';

export default class DepartamentoController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const departamentos = await DepartamentoEntity.findAll();

            res.status(200).json({
                message: 'Departments retrieved successfully',
                data: departamentos
            });
        } catch (error) {
            next(error);
        }
    }

    public static async readById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const departamento = await DepartamentoEntity.findById(Number(id));

            if (!departamento) {
                res.status(404).json({
                    ok: false,
                    error: 'Department not found'
                });
                return;
            }

            res.status(200).json({
                message: 'Department retrieved successfully',
                data: departamento
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            const newDepartamento = await DepartamentoEntity.create(data);

            res.status(201).json({
                message: 'Department created successfully',
                data: newDepartamento
            });
        } catch (error) {
            next(error);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;

            const updatedDepartamento = await DepartamentoEntity.update(Number(id), data);

            res.status(200).json({
                message: 'Department modified successfully',
                data: updatedDepartamento
            });
        } catch (error) {
            next(error);
        }
    }

    public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            await DepartamentoEntity.delete(Number(id));

            res.status(200).json({
                message: 'Department deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}