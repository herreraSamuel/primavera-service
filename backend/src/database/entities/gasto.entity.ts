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

    public static async create(data: {
        monto: number;
        descripcion_extra?: string | null;
        catalogo_gasto_id?: number | null;
        categoria?: string | null;
        fecha?: string | Date | null;
    }) {
        return await prisma.$transaction(async (tx) => {
            let catalogoId = data.catalogo_gasto_id;

            if (!catalogoId && data.categoria) {
                let tipoGasto = await tx.tipos_gasto.findFirst({
                    where: {
                        nombre: { equals: data.categoria, mode: 'insensitive' },
                        deleted_at: null
                    }
                });

                if (!tipoGasto) {
                    tipoGasto = await tx.tipos_gasto.create({
                        data: {
                            nombre: data.categoria,
                            categoria_gasto: 'VARIABLE'
                        }
                    });
                }

                let catalogItem = await tx.catalogo_gastos.findFirst({
                    where: {
                        tipo_gasto_id: tipoGasto.id,
                        deleted_at: null
                    }
                });

                if (!catalogItem) {
                    catalogItem = await tx.catalogo_gastos.create({
                        data: {
                            nombre: data.categoria,
                            tipo_gasto_id: tipoGasto.id,
                            monto_base: data.monto
                        }
                    });
                }

                catalogoId = catalogItem.id;
            }

            if (!catalogoId) {
                throw new Error('Catalog expense ID is required');
            }

            const recordDate = data.fecha ? new Date(data.fecha) : new Date();

            return await tx.registro_gastos.create({
                data: {
                    catalogo_gasto_id: catalogoId,
                    monto: data.monto,
                    descripcion_extra: data.descripcion_extra || null,
                    fecha: recordDate
                },
                include: {
                    catalogo_gastos: {
                        include: {
                            tipos_gasto: true
                        }
                    }
                }
            });
        });
    }

    public static async update(id: string, data: {
        monto?: number;
        descripcion_extra?: string | null;
        catalogo_gasto_id?: number;
        fecha?: string | Date;
    }) {
        return await prisma.$transaction(async (tx) => {
            const updateData: Prisma.registro_gastosUncheckedUpdateInput = {};
            if (data.monto !== undefined) updateData.monto = data.monto;
            if (data.descripcion_extra !== undefined) updateData.descripcion_extra = data.descripcion_extra;
            if (data.catalogo_gasto_id !== undefined) updateData.catalogo_gasto_id = data.catalogo_gasto_id;
            if (data.fecha !== undefined) updateData.fecha = new Date(data.fecha);

            return await tx.registro_gastos.update({
                where: { id: BigInt(id) },
                data: updateData
            });
        });
    }

    public static async delete(id: string) {
        return await prisma.registro_gastos.update({
            where: { id: BigInt(id) },
            data: { deleted_at: new Date() }
        });
    }

    public static async getMonthlySummary(month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const fixedCatalog = await prisma.catalogo_gastos.findMany({
            where: {
                deleted_at: null,
                tipos_gasto: {
                    categoria_gasto: 'FIJO'
                }
            },
            include: {
                tipos_gasto: true,
                registro_gastos: {
                    where: {
                        deleted_at: null,
                        fecha: {
                            gte: startDate,
                            lte: endDate
                        }
                    }
                }
            }
        });

        const variableRecords = await prisma.registro_gastos.findMany({
            where: {
                deleted_at: null,
                fecha: {
                    gte: startDate,
                    lte: endDate
                },
                catalogo_gastos: {
                    tipos_gasto: {
                        categoria_gasto: 'VARIABLE'
                    }
                }
            },
            include: {
                catalogo_gastos: {
                    include: {
                        tipos_gasto: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            }
        });

        let fixedConfirmedTotal = 0;
        let fixedPendingCount = 0;

        fixedCatalog.forEach(item => {
            if (item.registro_gastos.length > 0) {
                fixedConfirmedTotal += item.registro_gastos.reduce((sum, record) => sum + Number(record.monto), 0);
            } else {
                fixedPendingCount++;
            }
        });

        const variableTotal = variableRecords.reduce((sum, record) => sum + Number(record.monto), 0);

        const categories = await prisma.tipos_gasto.findMany({
            where: {
                deleted_at: null,
                OR: [
                    { categoria_gasto: 'VARIABLE' },
                    { categoria_gasto: null }
                ]
            },
            orderBy: {
                nombre: 'asc'
            }
        });

        return {
            summary: {
                fixedConfirmed: fixedConfirmedTotal,
                variables: variableTotal,
                total: fixedConfirmedTotal + variableTotal,
                fixedPendingCount
            },
            fixedExpenses: fixedCatalog,
            variableExpenses: variableRecords,
            categories
        };
    }
}
