import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Debe ser un email válido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});
