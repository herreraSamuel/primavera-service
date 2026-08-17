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

export interface DetalleGastoFijo {
  descripcion: string;
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
  detallesGastosFijos: DetalleGastoFijo[];
  gastosVariables: number;
  totalGastosOperacionales: number;
  utilidadNeta: number;
  margenNeto: number;
}

export interface EstadoResultadosData {
  resumen: ResumenFinanciero;
  ventasDetalle: VentaDetalleER[];
}
