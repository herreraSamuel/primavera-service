import { prisma } from '../database.js'

export default class ClientEntity {
    public static async findAll() {
        return await prisma.clientes.findMany();
    }

    public static async create(data: any) {
        return await prisma.clientes.create({ data });
    }
}

