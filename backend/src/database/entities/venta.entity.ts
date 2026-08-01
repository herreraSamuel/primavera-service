import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class VentaEntity {
    public static async findAll() {
        return await prisma.ventas.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    public static async findById(id: string) {
        return await prisma.ventas.findUnique({
            where: { id: BigInt(id) }
        });
    }

    public static async create(data: Prisma.ventasCreateInput) {
        return await prisma.ventas.create({ data });
    }

    public static async update(id: string, data: Prisma.ventasUpdateInput) {
        return await prisma.ventas.update({
            where: { id: BigInt(id) },
            data
        });
    }

    public static async delete(id: string) {
        return await prisma.ventas.delete({
            where: { id: BigInt(id) }
        });
    }
}
