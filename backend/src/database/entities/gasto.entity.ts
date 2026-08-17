import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class GastoEntity {
    public static async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        
        const where: Prisma.registro_gastosWhereInput = { deleted_at: null };
        
        if (search) {
            where.OR = [
                { descripcion_extra: { contains: search, mode: 'insensitive' } },
                { catalogo_gastos: { nombre: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.registro_gastos.findMany({
                where,
                include: { catalogo_gastos: true },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit
            }),
            prisma.registro_gastos.count({ where })
        ]);
        
        return { data, total, page, limit };
    }

    public static async findById(id: string) {
        return await prisma.registro_gastos.findUnique({
            where: { id: BigInt(id) },
            include: { catalogo_gastos: true }
        });
    }

    public static async create(data: Prisma.registro_gastosUncheckedCreateInput) {
        return await prisma.$transaction(async (tx) => {
            return await tx.registro_gastos.create({ data });
        });
    }

    public static async update(id: string, data: Prisma.registro_gastosUncheckedUpdateInput) {
        return await prisma.$transaction(async (tx) => {
            return await tx.registro_gastos.update({
                where: { id: BigInt(id) },
                data
            });
        });
    }

    public static async delete(id: string) {
        return await prisma.registro_gastos.update({
            where: { id: BigInt(id) },
            data: { deleted_at: new Date() }
        });
    }
}
