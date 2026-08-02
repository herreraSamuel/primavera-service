import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class AerolineasEntity {
    public static async findAll() {
        return await prisma.aerolineas.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    public static async findById(id: number) {
        return await prisma.aerolineas.findUnique({
            where: { id }
        });
    }

    public static async create(data: Prisma.aerolineasCreateInput) {
        return await prisma.aerolineas.create({ data });
    }

    public static async update(id: number, data: Prisma.aerolineasUpdateInput) {
        return await prisma.aerolineas.update({
            where: { id },
            data
        });
    }

    public static async delete(id: number) {
        return await prisma.aerolineas.delete({
            where: { id }
        });
    }
}
