import { prisma } from '../database.js'
import { Prisma } from '@prisma/client';

export default class DepartamentoEntity {
    public static async findAll() {
        return await prisma.departamentos.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    public static async findById(id: number) {
        return await prisma.departamentos.findUnique({
            where: { id }
        });
    }

    public static async create(data: Prisma.departamentosCreateInput) {
        return await prisma.departamentos.create({ data });
    }

    public static async update(id: number, data: Prisma.departamentosUpdateInput) {
        return await prisma.departamentos.update({
            where: { id },
            data
        });
    }

    public static async delete(id: number) {
        return await prisma.departamentos.delete({
            where: { id }
        });
    }
}
