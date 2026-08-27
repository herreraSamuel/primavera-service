import { z } from 'zod';

export const baseVentaSchema = z.object({
    numero_recibo: z
        .string({ message: 'El número de recibo es obligatorio' })
        .min(1, 'El número de recibo no puede estar vacío')
        .max(50, 'El número de recibo debe tener máximo 50 caracteres'),

    fecha_venta: z
        .string({ message: 'La fecha de venta es obligatoria' }),

    cliente_id: z
        .union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => Number.isInteger(val) && val > 0, {
            message: 'El cliente es obligatorio'
        }),

    monto_recibo: z
        .union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => !isNaN(val) && val >= 0, {
            message: 'El monto del recibo debe ser un número válido'
        }),

    monto_neto: z
        .union([z.number(), z.string()])
        .transform(val => Number(val))
        .refine(val => !isNaN(val) && val >= 0, {
            message: 'El monto neto debe ser un número válido'
        }),

    comision_operador: z
        .union([z.number(), z.string(), z.null()])
        .optional()
        .transform(val => (val === '' || val === null || val === undefined ? null : Number(val)))
        .refine(val => val === null || (!isNaN(val) && val >= 0), {
            message: 'La comisión debe ser un número válido'
        }),

    metodo_pago: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'], {
        message: 'Método de pago inválido'
    }),
}).strict();

export const ventaSchema = baseVentaSchema.refine((data) => data.monto_neto <= data.monto_recibo, {
    message: 'El monto neto no puede ser mayor al monto del recibo',
    path: ['monto_neto']
});

export const updateVentaSchema = baseVentaSchema.partial().refine((data) => {
    if (data.monto_neto !== undefined && data.monto_recibo !== undefined) {
        return data.monto_neto <= data.monto_recibo;
    }
    return true;
}, {
    message: 'El monto neto no puede ser mayor al monto del recibo',
    path: ['monto_neto']
});

export type VentaFormValues = z.input<typeof ventaSchema>;
