import { z } from 'zod';

export const createGastoSchema = z.object({
    monto: z
        .number({ message: 'Amount is required' })
        .positive({ message: 'Amount must be a positive value' }),

    descripcion_extra: z
        .string({ message: 'Extra description must be a string' })
        .max(255, { message: 'Extra description must be at most 255 characters' })
        .optional()
        .nullable(),

    catalogo_gasto_id: z
        .number({ message: 'Catalog expense ID is required' })
        .int({ message: 'Catalog expense ID must be an integer' })
        .positive({ message: 'Catalog expense ID must be a positive integer' }),

    fecha: z
        .string({ message: 'Date must be a string' })
        .datetime({ message: 'Date must be a valid ISO datetime' })
        .optional()
        .nullable()
}).strict();

export const updateGastoSchema = createGastoSchema.partial().strict();
