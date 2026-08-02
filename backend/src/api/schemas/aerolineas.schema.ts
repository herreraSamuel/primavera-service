import { z } from 'zod';

export const createAerolineasSchema = z.object({
    nombre: z
        .string({ message: 'Airline name is required' })
        .trim()
        .min(1, 'Airline name cannot be empty')
        .max(100, 'Airline name must be at most 100 characters')
}).strict();

export const updateAerolineasSchema = createAerolineasSchema.partial().strict();
