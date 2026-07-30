import { z } from 'zod';

export const createDepartamentoSchema = z.object({
    nombre: z
        .string({ message: 'Department name is required' })
        .trim()
        .min(3, 'Name must have at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters')
}).strict();

export const updateDepartamentoSchema = createDepartamentoSchema.partial().strict();
