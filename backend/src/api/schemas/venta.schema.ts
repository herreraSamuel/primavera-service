import { z } from 'zod';

export const createVentaSchema = z.object({
    numero_recibo: z
        .string({ message: 'Receipt number is required' })
        .trim()
        .min(1, 'Receipt number cannot be empty')
        .max(50, 'Receipt number must be at most 50 characters'),

    cliente_id: z
        .number({ message: 'Client ID is required' })
        .int('Client ID must be an integer')
        .positive('Client ID must be a positive integer'),

    monto_recibo: z
        .number({ message: 'Receipt amount is required' })
        .nonnegative('Receipt amount must be a positive value or zero'),

    monto_neto: z
        .number({ message: 'Net amount is required' })
        .nonnegative('Net amount must be a positive value or zero'),

    comision_operador: z
        .number()
        .nonnegative('Operator commission must be a positive value or zero')
        .optional()
        .nullable(),

    metodo_pago: z
        .enum(['EFECTIVO', 'TARJETA'] as const, { message: 'Payment method must be EFECTIVO or TARJETA' })
        .optional()
        .nullable()
}).strict();

export const updateVentaSchema = createVentaSchema.partial().strict();
