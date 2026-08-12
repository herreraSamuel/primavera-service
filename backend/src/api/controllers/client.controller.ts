import type { Request, Response, NextFunction } from 'express';
import ClientEntity from '../../database/entities/client.entity.js';
import { NotFound, BadRequest } from '../errors/app.error.js';

export default class ClientController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const skip = (page - 1) * limit;

            const [clients, total] = await Promise.all([
                ClientEntity.findAll(skip, limit, search),
                ClientEntity.countAll(search)
            ]);

            const totalPages = Math.ceil(total / limit);

            res.status(200).json({
                message: 'Clients retrieved successfully',
                data: clients,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages
                }
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

            const client = await ClientEntity.findById(id);

            if (!client) {
                throw new NotFound("Client not found");
            }

            res.status(200).json({
                message: 'Client retrieved successfully',
                data: client
            });
        } catch (error) {
            next(error);
        }
    }

    public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;

            if (!data || Object.keys(data).length === 0) {
                throw new BadRequest("Missing data in the request");
            }

            const newClient = await ClientEntity.create(data);
            res.status(201).json({
                message: 'Client created successfully',
                data: newClient
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

            const clientData = req.body;

            const updatedClient = await ClientEntity.update(id, clientData);
            res.json({
                message: 'Client modified successfully',
                data: updatedClient
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

            await ClientEntity.delete(id);
            res.json({
                message: 'Client deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}