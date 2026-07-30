import type { Request, Response, NextFunction } from 'express';
import ClientEntity from '../../database/entities/client.entity.js';
import { NotFound, BadRequest } from '../errors/client.errors.js';

export default class ClientController {

    public static async read(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clients = await ClientEntity.findAll();

            if (!clients || clients.length === 0) {
                throw new NotFound("No clients found");
            }

            res.status(200).json(clients);
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
            res.status(201).json(newClient);
        } catch (error) {
            next(error);
        }
    }

    public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
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
            const { id } = req.params as { id: string };

            await ClientEntity.delete(id);
            res.json({
                message: 'Client deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}