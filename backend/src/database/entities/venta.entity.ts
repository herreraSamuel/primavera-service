import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class VentaEntity {
    public static async findAll(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;
        
        const where: Prisma.ventasWhereInput = { deleted_at: null };
        
        if (search) {
            where.OR = [
                { numero_recibo: { contains: search, mode: 'insensitive' } },
                { clientes: { primer_nombre: { contains: search, mode: 'insensitive' } } },
                { clientes: { primer_apellido: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [data, total] = await Promise.all([
            prisma.ventas.findMany({
                where,
                include: { clientes: true },
                orderBy: { created_at: 'desc' },
                skip,
                take: limit
            }),
            prisma.ventas.count({ where })
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
