import type { Request, Response } from 'express';
import ClientEntity from '../../database/entities/client.entity.js';
import { NotFound, BadRequest } from '../errors/client.errors.js';

export default class ClientController {

    public static async read(req: Request, res: Response): Promise<void> {
        const clients = await ClientEntity.findAll();

        if (!clients || clients.length === 0) {
            throw new NotFound("No clients found");
        }

        res.status(200).json(clients);
    }

    public static async create(req: Request, res: Response): Promise<void> {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            throw new BadRequest("Missing data in the request");
        }

        const newClient = await ClientEntity.create(data);
        res.status(201).json(newClient);
    }
}