import { z } from 'zod';

export const createClientSchema = z.object({
    // Required fields
    primer_nombre: z
        .string({ message: 'First name is required' })
        .min(1, 'First name cannot be empty')
        .max(100, 'First name must be at most 100 characters'),

    primer_apellido: z
        .string({ message: 'Last name is required' })
        .min(1, 'Last name cannot be empty')
        .max(100, 'Last name must be at most 100 characters'),

    // Optional fields (nullable in Prisma)
    segundo_nombre: z
        .string()
        .max(100, 'Second name must be at most 100 characters')
        .optional()
        .nullable(),

    segundo_apellido: z
        .string()
        .max(100, 'Second name must be at most 100 characters')
        .optional()
        .nullable(),

    nit: z
        .string()
        .max(20, 'NIT must be at most 20 characters')
        .optional()
        .nullable(),

    documento_identidad: z
        .string()
        .max(30, 'Identity document must be at most 30 characters')
        .optional()
        .nullable(),

    direccion: z
        .string()
        .optional()
        .nullable(),

    telefono: z
        .string()
        .max(20, 'Phone number must be at most 20 characters')
        .optional()
        .nullable(),

    correo_electronico: z
        .string()
        .email('Invalid email address format')
        .max(255, 'Email must be at most 255 characters')
        .optional()
        .nullable(),

    departamento_id: z
        .number({ message: 'Department ID must be a number' })
        .int('Department ID must be an integer')
        .positive('Department ID must be a positive integer')
        .optional()
        .nullable(),
}).strict();