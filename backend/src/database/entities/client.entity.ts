import { prisma } from '../database.js'
import { Prisma } from '@prisma/client';


export default class ClientEntity {
    public static async findAll(skip: number = 0, take: number = 10, search?: string) {
        const where: Prisma.clientesWhereInput = { deleted_at: null };
        if (search) {
            where.OR = [
                { primer_nombre: { contains: search, mode: 'insensitive' } },
                { segundo_nombre: { contains: search, mode: 'insensitive' } },
                { primer_apellido: { contains: search, mode: 'insensitive' } },
                { segundo_apellido: { contains: search, mode: 'insensitive' } }
            ];
        }
        return await prisma.clientes.findMany({
            skip,
            take,
            where,
            include: {
                departamento: true
            }
        });
    }

    public static async countAll(search?: string) {
        const where: Prisma.clientesWhereInput = { deleted_at: null };
        if (search) {
            where.OR = [
                { primer_nombre: { contains: search, mode: 'insensitive' } },
                { segundo_nombre: { contains: search, mode: 'insensitive' } },
                { primer_apellido: { contains: search, mode: 'insensitive' } },
                { segundo_apellido: { contains: search, mode: 'insensitive' } }
            ];
        }
        return await prisma.clientes.count({
            where
        });
    }

    public static async findById(id: string) {
        return await prisma.clientes.findFirst({
            where: {
                id: BigInt(id),
                deleted_at: null
            },
            include: {
                departamento: true
            }
        });
    }


    public static async create(data: Prisma.clientesCreateInput) {
        return await prisma.clientes.create({ data });
    }

    public static async update(id: string, data: Prisma.clientesUpdateInput) {
        return await prisma.clientes.update({
            where: { id: BigInt(id) },
            data
        });
    }

    public static async delete(id: string) {
        return await prisma.clientes.update({
            where: { id: BigInt(id) },
            data: {
                deleted_at: new Date()
            }
        });
    }
}

