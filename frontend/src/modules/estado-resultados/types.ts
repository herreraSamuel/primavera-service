export interface VentaDetalleER {
  id: string;
  recibo: string;
  cliente: string;
  metodoPago: "TARJETA" | "EFECTIVO" | "TRANSFERENCIA";
  montoBruto: number;
  montoNeto: number;
  gananciaNeta: number;
  comisionOperador: number;
}

export interface DetalleGastoItem {
  descripcion: string;
  monto: number;
}

export interface GastoRegistroDetalle {
  id: string;
  descripcion: string;
  categoria: string;
  fecha: string;
  monto: number;
}

export interface ResumenFinanciero {
  ventasRegistradas: number;
  totalVentasBrutas: number;
  costoServiciosNeto: number;
  gananciaNetaVentas: number;
  comisionOperadoresTotal: number;
  totalIngresosAgencia: number;
  gastosFijosConfirmados: number;
  detallesGastosFijos: DetalleGastoItem[];
  gastosVariables: number;
  detallesGastosVariables: DetalleGastoItem[];
  totalGastosOperacionales: number;
  utilidadNeta: number;
  margenNeto: number;
}

export interface EstadoResultadosData {
  resumen: ResumenFinanciero;
  ventasDetalle: VentaDetalleER[];
  gastosFijosDetalle: GastoRegistroDetalle[];
  gastosVariablesDetalle: GastoRegistroDetalle[];
}
