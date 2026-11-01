import { prisma } from '../database.js'
import { Prisma } from '@prisma/client';


export default class ClientEntity {
    private static buildSearchWhere(search?: string): Prisma.clientesWhereInput {
        const where: Prisma.clientesWhereInput = { deleted_at: null };
        if (!search) return where;

        const terms = search.trim().split(/\s+/).filter(Boolean);
        if (terms.length === 0) return where;

        where.AND = terms.map((term): Prisma.clientesWhereInput => ({
            OR: [
                { primer_nombre: { contains: term, mode: 'insensitive' } },
                { segundo_nombre: { contains: term, mode: 'insensitive' } },
                { primer_apellido: { contains: term, mode: 'insensitive' } },
                { segundo_apellido: { contains: term, mode: 'insensitive' } },
                { nit: { contains: term, mode: 'insensitive' } },
                { documento_identidad: { contains: term, mode: 'insensitive' } },
                { telefono: { contains: term, mode: 'insensitive' } },
                { correo_electronico: { contains: term, mode: 'insensitive' } }
            ]
        }));

        return where;
    }

    public static async findAll(skip: number = 0, take: number = 10, search?: string) {
        const where = this.buildSearchWhere(search);
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
        const where = this.buildSearchWhere(search);
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

