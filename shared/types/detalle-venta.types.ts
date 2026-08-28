export interface Servicio {
    id: number;
    nombre: string;
}

export interface Pais {
    id: number;
    iso: string;
    nombre: string;
}

export interface Aerolinea {
    id: number;
    nombre: string;
}

export interface Proveedor {
    id: number;
    nombre: string;
}

export interface DetalleVenta {
    id: number | string;
    venta_id: number | string;
    servicio_id: number | null;
    tipo_viaje: 'SOLO_IDA' | 'IDA_Y_VUELTA' | null;
    origen_pais_id: number | null;
    destino_pais_id: number | null;
    cantidad_pasajeros: number;
    precio_unitario: number;
    proveedor_id: number | null;
    aerolinea_id: number | null;
    detalles_especificos: string | null;
    created_at: Date | string | null;
    updated_at: Date | string | null;
    servicios?: Servicio | null;
    pais_origen?: Pais | null;
    pais_destino?: Pais | null;
    aerolineas?: Aerolinea | null;
    operadores_proveedores?: Proveedor | null;
}

export type CreateDetalleVentaDTO = {
    venta_id: number;
    servicio_id?: number | null;
    tipo_viaje?: 'SOLO_IDA' | 'IDA_Y_VUELTA' | null;
    origen_pais_id?: number | null;
    destino_pais_id?: number | null;
    cantidad_pasajeros?: number;
    precio_unitario?: number;
    proveedor_id?: number | null;
    aerolinea_id?: number | null;
    detalles_especificos?: string | null;
};
