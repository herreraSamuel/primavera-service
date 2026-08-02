import { z } from 'zod';

export const createOperadoresSchema = z.object({
    nombre: z
        .string({ message: 'Operator name is required' })
        .trim()
        .min(1, 'Operator name cannot be empty')
        .max(100, 'Operator name must be at most 100 characters')
}).strict();

export const updateOperadoresSchema = createOperadoresSchema.partial().strict();
