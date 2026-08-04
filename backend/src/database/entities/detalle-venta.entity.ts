import { prisma } from '../database.js';
import { Prisma } from '@prisma/client';

export default class DetalleVentaEntity {
    public static async findAll() {
        return await prisma.detalles_venta.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    public static async findByVentaId(ventaId: string) {
        return await prisma.detalles_venta.findMany({
            where: { venta_id: BigInt(ventaId) }
        });
    }

    public static async findById(id: string) {
        return await prisma.detalles_venta.findUnique({
            where: { id: BigInt(id) }
        });
    }

    public static async create(data: Prisma.detalles_ventaUncheckedCreateInput) {
        return await prisma.detalles_venta.create({ data });
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
