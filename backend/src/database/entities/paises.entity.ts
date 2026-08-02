import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class PaisesEntity {
    public static async findAll() {
        return await prisma.paises.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    public static async findById(id: number) {
        return await prisma.paises.findUnique({
            where: { id }
        });
    }

    public static async create(data: Prisma.paisesCreateInput) {
        return await prisma.paises.create({ data });
    }

    public static async update(id: number, data: Prisma.paisesUpdateInput) {
        return await prisma.paises.update({
            where: { id },
            data
        });
    }

    public static async delete(id: number) {
        return await prisma.paises.delete({
            where: { id }
        });
    }
}
