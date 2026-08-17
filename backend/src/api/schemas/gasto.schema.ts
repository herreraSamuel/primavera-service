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
        .number({ message: 'Catalog expense ID must be a number' })
        .int({ message: 'Catalog expense ID must be an integer' })
        .positive({ message: 'Catalog expense ID must be a positive integer' })
        .optional()
        .nullable(),

    categoria: z
        .string({ message: 'Category must be a string' })
        .trim()
        .min(1, { message: 'Category cannot be empty' })
        .max(100, { message: 'Category must be at most 100 characters' })
        .optional()
        .nullable(),

    fecha: z
        .string({ message: 'Date must be a string' })
        .optional()
        .nullable()
}).strict().refine((data) => data.catalogo_gasto_id || data.categoria, {
    message: 'Either catalogo_gasto_id or categoria is required',
    path: ['categoria']
});

export const updateGastoSchema = z.object({
    monto: z
        .number({ message: 'Amount must be a number' })
        .positive({ message: 'Amount must be a positive value' })
        .optional(),

    descripcion_extra: z
        .string({ message: 'Extra description must be a string' })
        .max(255, { message: 'Extra description must be at most 255 characters' })
        .optional()
        .nullable(),

    catalogo_gasto_id: z
        .number({ message: 'Catalog expense ID must be an integer' })
        .int({ message: 'Catalog expense ID must be an integer' })
        .positive({ message: 'Catalog expense ID must be a positive integer' })
        .optional(),

    fecha: z
        .string({ message: 'Date must be a string' })
        .optional()
        .nullable()
}).strict();
