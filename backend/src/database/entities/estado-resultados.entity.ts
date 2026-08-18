import { prisma } from '../database.js';

export default class EstadoResultadosEntity {

    public static async getResumen(month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const ventasWhere = {
            deleted_at: null,
            fecha_venta: { gte: startDate, lte: endDate }
        };

        const [ventasAgg, ventasCount] = await Promise.all([
            prisma.ventas.aggregate({
                where: ventasWhere,
                _sum: {
                    monto_recibo: true,
                    monto_neto: true,
                    comision_operador: true,
                },
            }),
            prisma.ventas.count({ where: ventasWhere }),
        ]);

        const ventasDetalle = await prisma.ventas.findMany({
            where: ventasWhere,
            include: {
                clientes: true,
            },
            orderBy: { fecha_venta: 'asc' },
        });

        const gastosFijos = await prisma.catalogo_gastos.findMany({
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
                        fecha: { gte: startDate, lte: endDate }
                    }
                }
            }
        });

        const gastosVariables = await prisma.registro_gastos.findMany({
            where: {
                deleted_at: null,
                fecha: { gte: startDate, lte: endDate },
                catalogo_gastos: {
                    tipos_gasto: {
                        categoria_gasto: 'VARIABLE'
                    }
                }
            },
            include: {
                catalogo_gastos: {
                    include: { tipos_gasto: true }
                }
            },
            orderBy: { fecha: 'desc' }
        });

        const totalVentasBrutas = Number(ventasAgg._sum.monto_recibo ?? 0);
        const costoServiciosNeto = Number(ventasAgg._sum.monto_neto ?? 0);
        const gananciaNetaVentas = totalVentasBrutas - costoServiciosNeto;
        const comisionOperadoresTotal = Number(ventasAgg._sum.comision_operador ?? 0);
        
        const totalIngresosAgencia = gananciaNetaVentas + comisionOperadoresTotal;

        let gastosFijosTotal = 0;
        const detallesGastosFijos: { descripcion: string; monto: number }[] = [];
        const gastosFijosDetalle: { id: string; descripcion: string; categoria: string; fecha: string; monto: number }[] = [];

        gastosFijos.forEach(item => {
            const montoConfirmado = item.registro_gastos.reduce(
                (sum, record) => sum + Number(record.monto), 0
            );
            if (montoConfirmado > 0) {
                gastosFijosTotal += montoConfirmado;
                detallesGastosFijos.push({
                    descripcion: item.nombre,
                    monto: montoConfirmado
                });
            }

            item.registro_gastos.forEach(record => {
                const monto = Number(record.monto);
                if (monto > 0) {
                    gastosFijosDetalle.push({
                        id: record.id.toString(),
                        descripcion: record.descripcion_extra ? `${item.nombre} (${record.descripcion_extra})` : item.nombre,
                        categoria: item.tipos_gasto?.nombre ?? 'Fijo',
                        fecha: record.fecha ? record.fecha.toISOString().substring(0, 10) : '',
                        monto
                    });
                }
            });
        });

        const gastosVariablesTotal = gastosVariables.reduce(
            (sum, record) => sum + Number(record.monto), 0
        );

        const detallesGastosVariables: { descripcion: string; monto: number }[] = [];
        const gastosVariablesDetalle: { id: string; descripcion: string; categoria: string; fecha: string; monto: number }[] = [];

        gastosVariables.forEach(record => {
            const desc = record.descripcion_extra 
                ? `${record.catalogo_gastos.nombre} (${record.descripcion_extra})` 
                : record.catalogo_gastos.nombre;
            
            detallesGastosVariables.push({
                descripcion: desc,
                monto: Number(record.monto)
            });

            gastosVariablesDetalle.push({
                id: record.id.toString(),
                descripcion: desc,
                categoria: record.catalogo_gastos.tipos_gasto?.nombre ?? 'Variable',
                fecha: record.fecha ? record.fecha.toISOString().substring(0, 10) : '',
                monto: Number(record.monto)
            });
        });

        const totalGastosOperacionales = gastosFijosTotal + gastosVariablesTotal;

        const utilidadNeta = totalIngresosAgencia - totalGastosOperacionales;

        const margenNeto = totalIngresosAgencia > 0
            ? parseFloat(((utilidadNeta / totalIngresosAgencia) * 100).toFixed(1))
            : 0;

        return {
            resumen: {
                ventasRegistradas: ventasCount,
                totalVentasBrutas,
                costoServiciosNeto,
                gananciaNetaVentas,
                comisionOperadoresTotal,
                totalIngresosAgencia,
                gastosFijosConfirmados: gastosFijosTotal,
                detallesGastosFijos,
                gastosVariables: gastosVariablesTotal,
                detallesGastosVariables,
                totalGastosOperacionales,
                utilidadNeta,
                margenNeto,
            },
            ventasDetalle: ventasDetalle.map(v => ({
                id: v.id.toString(),
                recibo: v.numero_recibo,
                cliente: v.clientes
                    ? `${v.clientes.primer_nombre} ${v.clientes.segundo_nombre ?? ''} ${v.clientes.primer_apellido} ${v.clientes.segundo_apellido ?? ''}`.replace(/\s+/g, ' ').trim()
                    : 'Sin cliente',
                metodoPago: v.metodo_pago,
                montoBruto: Number(v.monto_recibo),
                montoNeto: Number(v.monto_neto),
                gananciaNeta: Number(v.monto_recibo) - Number(v.monto_neto),
                comisionOperador: Number(v.comision_operador ?? 0),
            })),
            gastosFijosDetalle,
            gastosVariablesDetalle,
        };
    }
}
