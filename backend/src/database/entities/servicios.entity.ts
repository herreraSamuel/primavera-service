import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class ServiciosEntity {
    public static async findAll() {
        return await prisma.servicios.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    public static async findById(id: number) {
        return await prisma.servicios.findUnique({
            where: { id }
        });
    }

    public static async create(data: Prisma.serviciosCreateInput) {
        return await prisma.servicios.create({ data });
    }

    public static async update(id: number, data: Prisma.serviciosUpdateInput) {
        return await prisma.servicios.update({
            where: { id },
            data
        });
    }

    public static async delete(id: number) {
        return await prisma.servicios.delete({
            where: { id }
        });
    }
}
