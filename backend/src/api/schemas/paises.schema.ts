import { z } from 'zod';

export const createPaisesSchema = z.object({
    iso: z
        .string({ message: 'ISO code is required' })
        .trim()
        .min(1, 'ISO code cannot be empty')
        .max(10, 'ISO code must be at most 10 characters'),

    nombre: z
        .string({ message: 'Country name is required' })
        .trim()
        .min(1, 'Country name cannot be empty')
        .max(100, 'Country name must be at most 100 characters')
}).strict();

export const updatePaisesSchema = createPaisesSchema.partial().strict();
