import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

const DETALLE_INCLUDES = {
    servicios: true,
    pais_origen: true,
    pais_destino: true,
    operadores_proveedores: true
} as const;

export default class DetalleVentaEntity {
    public static async findAll() {
        return await prisma.detalles_venta.findMany({
            include: DETALLE_INCLUDES,
            orderBy: { created_at: 'desc' }
        });
    }

    public static async findByVentaId(ventaId: string) {
        return await prisma.detalles_venta.findMany({
            where: { venta_id: BigInt(ventaId) },
            include: DETALLE_INCLUDES,
            orderBy: { created_at: 'asc' }
        });
    }

    public static async findById(id: string) {
        return await prisma.detalles_venta.findUnique({
            where: { id: BigInt(id) },
            include: DETALLE_INCLUDES
        });
    }

    public static async create(data: Prisma.detalles_ventaUncheckedCreateInput) {
        return await prisma.detalles_venta.create({
            data,
            include: DETALLE_INCLUDES
        });
    }

    public static async createMany(items: Prisma.detalles_ventaUncheckedCreateInput[]) {
        return await prisma.$transaction(
            items.map(item => prisma.detalles_venta.create({
                data: item,
                include: DETALLE_INCLUDES
            }))
        );
    }

    public static async update(id: string, data: Prisma.detalles_ventaUncheckedUpdateInput) {
        return await prisma.detalles_venta.update({
            where: { id: BigInt(id) },
            data
        });
    }

    public static async delete(id: string) {
        return await prisma.detalles_venta.delete({
            where: { id: BigInt(id) }
        });
    }
}
