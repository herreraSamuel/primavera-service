import { z } from 'zod';

export const createDetalleVentaSchema = z.object({
    venta_id: z
        .number({ message: 'Sale ID is required' })
        .int('Sale ID must be an integer')
        .positive('Sale ID must be a positive integer'),

    servicio_id: z
        .number({ message: 'Service ID must be a number' })
        .int('Service ID must be an integer')
        .positive('Service ID must be a positive integer')
        .optional()
        .nullable(),

    tipo_viaje: z
        .enum(['SOLO_IDA', 'IDA_Y_VUELTA'] as const, { message: 'Trip type must be SOLO_IDA or IDA_Y_VUELTA' })
        .optional()
        .nullable(),

    origen_pais_id: z
        .number({ message: 'Origin country ID must be a number' })
        .int('Origin country ID must be an integer')
        .positive('Origin country ID must be a positive integer')
        .optional()
        .nullable(),

    destino_pais_id: z
        .number({ message: 'Destination country ID must be a number' })
        .int('Destination country ID must be an integer')
        .positive('Destination country ID must be a positive integer')
        .optional()
        .nullable(),

    cantidad_pasajeros: z
        .number({ message: 'Passenger count must be a number' })
        .int('Passenger count must be an integer')
        .positive('Passenger count must be at least 1')
        .optional(),

    precio_unitario: z
        .number({ message: 'Unit price must be a number' })
        .nonnegative('Unit price must be a positive value or zero')
        .optional(),

    proveedor_id: z
        .number({ message: 'Provider ID must be a number' })
        .int('Provider ID must be an integer')
        .positive('Provider ID must be a positive integer')
        .optional()
        .nullable(),

    aerolinea_id: z
        .number({ message: 'Airline ID must be a number' })
        .int('Airline ID must be an integer')
        .positive('Airline ID must be a positive integer')
        .optional()
        .nullable(),

    detalles_especificos: z
        .string()
        .optional()
        .nullable()
}).strict();

export const updateDetalleVentaSchema = createDetalleVentaSchema.partial().strict();
