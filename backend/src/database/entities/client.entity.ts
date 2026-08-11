import { prisma } from '../database.js'
import { Prisma } from '@prisma/client';


export default class ClientEntity {
    public static async findAll(skip: number = 0, take: number = 10) {
        return await prisma.clientes.findMany({
            skip,
            take,
            where: {
                deleted_at: null
            },
            include: {
                departamento: true
            }
        });
    }

    public static async countAll() {
        return await prisma.clientes.count({
            where: {
                deleted_at: null
            }
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

