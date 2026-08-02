import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class OperadoresEntity {
    public static async findAll() {
        return await prisma.operadores_proveedores.findMany({
            orderBy: { nombre: 'asc' }
        });
    }

    public static async findById(id: number) {
        return await prisma.operadores_proveedores.findUnique({
            where: { id }
        });
    }

    public static async create(data: Prisma.operadores_proveedoresCreateInput) {
        return await prisma.operadores_proveedores.create({ data });
    }

    public static async update(id: number, data: Prisma.operadores_proveedoresUpdateInput) {
        return await prisma.operadores_proveedores.update({
            where: { id },
            data
        });
    }

    public static async delete(id: number) {
        return await prisma.operadores_proveedores.delete({
            where: { id }
        });
    }
}
