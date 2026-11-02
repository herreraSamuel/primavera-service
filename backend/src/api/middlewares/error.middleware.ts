import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app.error.js';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            ok: false,
            message: err.message,
            error: err.message,
        });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': {
                const targetRaw = err.meta?.target;
                const targets: string[] = Array.isArray(targetRaw)
                    ? targetRaw.map(String)
                    : typeof targetRaw === 'string'
                        ? [targetRaw]
                        : [];

                const targetStr = targets.join(' ').toLowerCase();

                let friendlyMessage = 'Ya existe un registro con estos datos en el sistema (valor duplicado).';
                let detectedField = 'documento_identidad';

                if (targetStr.includes('documento_identidad')) {
                    detectedField = 'documento_identidad';
                    friendlyMessage = 'Ya existe un cliente registrado con este Documento de Identidad (DPI/CUI). Por favor verifica el número ingresado.';
                } else if (targetStr.includes('numero_recibo')) {
                    detectedField = 'numero_recibo';
                    friendlyMessage = 'Ya existe una venta registrada con este Número de Recibo. Por favor ingresa un número de recibo diferente.';
                } else if (targetStr.includes('correo') || targetStr.includes('email')) {
                    detectedField = 'correo_electronico';
                    friendlyMessage = 'Ya existe un registro con este Correo Electrónico. Por favor utiliza una dirección diferente.';
                } else if (targetStr.includes('nit')) {
                    detectedField = 'nit';
                    friendlyMessage = 'Ya existe un cliente con este NIT registrado en el sistema.';
                } else if (targetStr.includes('telefono')) {
                    detectedField = 'telefono';
                    friendlyMessage = 'Ya existe un registro con este número de teléfono.';
                } else if (targets.length > 0) {
                    friendlyMessage = `Ya existe un registro con el mismo valor para: ${targets.join(', ')}.`;
                    detectedField = targets[0] || 'documento_identidad';
                }

                res.status(409).json({
                    ok: false,
                    message: friendlyMessage,
                    error: friendlyMessage,
                    errors: [
                        {
                            field: detectedField,
                            message: friendlyMessage,
                        }
                    ]
                });
                return;
            }

            case 'P2003': {
                const fieldName = String(err.meta?.field_name || '').toLowerCase();
                let friendlyMessage = 'No se puede guardar porque hace referencia a un elemento que no existe o fue eliminado.';
                if (fieldName.includes('departamento')) {
                    friendlyMessage = 'El departamento seleccionado no es válido o no existe.';
                } else if (fieldName.includes('cliente')) {
                    friendlyMessage = 'El cliente seleccionado no es válido o no existe.';
                }

                res.status(400).json({
                    ok: false,
                    message: friendlyMessage,
                    error: friendlyMessage,
                });
                return;
            }

            case 'P2025': {
                const message = 'El registro solicitado no fue encontrado o ya ha sido eliminado.';
                res.status(404).json({
                    ok: false,
                    message,
                    error: message,
                });
                return;
            }

            default: {
                res.status(400).json({
                    ok: false,
                    message: 'Ocurrió un error en la base de datos al procesar la solicitud.',
                    error: `Database error (${err.code})`,
                });
                return;
            }
        }
    }

    console.error('Unexpected error:', err);
    res.status(500).json({ 
        ok: false, 
        message: 'Ocurrió un error inesperado en el servidor. Por favor intenta de nuevo.',
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    });
};