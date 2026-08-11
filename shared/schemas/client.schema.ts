import { z } from 'zod';

export const clientSchema = z.object({
    primer_nombre: z
        .string({ message: 'El primer nombre es obligatorio' })
        .min(1, 'El primer nombre no puede estar vacío')
        .max(100, 'El primer nombre debe tener máximo 100 caracteres'),

    primer_apellido: z
        .string({ message: 'El primer apellido es obligatorio' })
        .min(1, 'El primer apellido no puede estar vacío')
        .max(100, 'El primer apellido debe tener máximo 100 caracteres'),

    segundo_nombre: z
        .string()
        .max(100, 'El segundo nombre debe tener máximo 100 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    segundo_apellido: z
        .string()
        .max(100, 'El segundo apellido debe tener máximo 100 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    nit: z
        .string()
        .max(20, 'El NIT debe tener máximo 20 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    documento_identidad: z
        .string()
        .max(30, 'El documento de identidad debe tener máximo 30 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    direccion: z
        .string()
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    telefono: z
        .string()
        .max(20, 'El teléfono debe tener máximo 20 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    correo_electronico: z
        .string()
        .email('Formato de correo electrónico inválido')
        .max(255, 'El correo debe tener máximo 255 caracteres')
        .nullable()
        .optional()
        .or(z.literal(''))
        .transform(val => val === '' ? null : val),

    departamento_id: z
        .union([z.number(), z.string(), z.null()])
        .optional()
        .transform(val => (val === '' || val === null || val === undefined ? null : Number(val)))
        .refine(val => val === null || (Number.isInteger(val) && val > 0), {
            message: 'El ID del departamento debe ser un entero positivo'
        }),
}).strict();

export type ClientFormValues = z.input<typeof clientSchema>;

