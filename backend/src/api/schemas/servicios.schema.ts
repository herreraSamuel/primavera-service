import { z } from 'zod';

export const createServiciosSchema = z.object({
    nombre: z
        .string({ message: 'Service name is required' })
        .trim()
        .min(1, 'Service name cannot be empty')
        .max(100, 'Service name must be at most 100 characters')
}).strict();

export const updateServiciosSchema = createServiciosSchema.partial().strict();
