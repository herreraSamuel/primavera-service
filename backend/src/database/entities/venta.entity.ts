import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class VentaEntity {
    public static async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            prisma.ventas.findMany({
                where: { deleted_at: null },
                include: { clientes: true },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit
            }),
            prisma.ventas.count({ where: { deleted_at: null } })
        ]);
        return { data, total, page, limit };
    }

    public static async findById(id: string) {
        return await prisma.ventas.findUnique({
            where: { id: BigInt(id) },
            include: {
                clientes: true
            }
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
        return await prisma.ventas.update({
            where: { id: BigInt(id) },
            data: {
                deleted_at: new Date()
            }
        });
    }
}
