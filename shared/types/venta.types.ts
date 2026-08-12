export interface Venta {
  id: number | string;
  numero_recibo: string;
  fecha_venta: Date | string;
  cliente_id: number | string;
  monto_recibo: number;
  monto_neto: number;
  comision_operador: number | null;
  metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  deleted_at: Date | string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
  clientes?: {
    id: number | string;
    primer_nombre: string;
    primer_apellido: string;
  } | null;
}

export type CreateVentaDTO = Omit<Venta, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'clientes'>;
