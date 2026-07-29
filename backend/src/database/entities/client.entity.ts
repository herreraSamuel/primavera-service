import { prisma } from '../database.js'

export default class ClientEntity {
    public static async findAll() {
        return await prisma.clientes.findMany({
            where: {
                deleted_at: null
            }
        });

    }

    public static async create(data: any) {
        return await prisma.clientes.create({ data });
    }

    public static async update(id: string, data: any) {
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

