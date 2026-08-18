"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Printer, ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { useEstadoResultados } from "../useEstadoResultados";

export default function EstadoResultados() {
  const [activeTab, setActiveTab] = useState<"resumen" | "detallado">("resumen");
  const {
    data,
    isLoading,
    isError,
    error,
    year,
    goToPreviousMonth,
    goToNextMonth,
    monthName,
    formatCurrency,
  } = useEstadoResultados();

  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  const resumen = data?.resumen;
  const ventasDetalle = data?.ventasDetalle ?? [];
  const gastosFijosDetalle = data?.gastosFijosDetalle ?? [];
  const gastosVariablesDetalle = data?.gastosVariablesDetalle ?? [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50 print:bg-white print:p-0 print:m-0 print:max-w-none print:min-h-0 print:w-full">
      <div className="mb-8 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Estado de Resultados</h1>
            <p className="text-slate-500">Resumen financiero mensual — ingresos, costos, gastos y utilidad.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
              <button
                onClick={goToPreviousMonth}
                aria-label="Mes anterior"
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold px-4 text-slate-700 min-w-[140px] text-center">
                {monthName} {year}
              </span>
              <button
                onClick={goToNextMonth}
                aria-label="Mes siguiente"
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors mr-2"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-200 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Printer className="w-5 h-5" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("resumen")}
            className={`px-5 py-2 rounded-full font-semibold transition-all shadow-sm ${
              activeTab === "resumen"
                ? "bg-[#F2B138] text-slate-900"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab("detallado")}
            className={`px-5 py-2 rounded-full font-semibold transition-all shadow-sm ${
              activeTab === "detallado"
                ? "bg-[#F2B138] text-slate-900"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Detallado
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[#0367A6] animate-spin" />
            <p className="text-slate-500 font-medium">Cargando estado de resultados...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-96">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
            <p className="text-red-600 font-semibold mb-2">Error al cargar los datos</p>
            <p className="text-red-500 text-sm">{error?.message || "Ocurrió un error inesperado"}</p>
          </div>
        </div>
      )}

      {!isLoading && !isError && resumen && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:w-full">
          
          <div className="lg:col-span-2 print:col-span-3 print:w-full print:block print:max-w-none print:m-0">
            <div 
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-0 print:shadow-none"
              style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" } as React.CSSProperties}
            >
              <div className="hidden print:flex flex-col items-center justify-center pt-8 pb-6 w-full bg-white">
                <div className="relative w-64 h-24">
                  <Image
                    src="/Logo 21 años Xela.png"
                    alt="Viajes Primavera Xela"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 flex flex-col md:flex-row justify-between items-start md:items-end rounded-t-2xl print:rounded-none print:bg-white print:text-slate-800 print:px-0 print:py-6 print:border-b print:border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1 print:text-slate-900">VIAJES PRIMAVERA</h2>
                  <p className="text-slate-400 font-medium text-sm tracking-widest uppercase print:text-slate-500 print:text-xs">
                    ESTADO DE RESULTADOS · {activeTab === "resumen" ? "RESUMEN" : "DETALLADO"}
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-[#F2B138] font-bold text-xl print:text-slate-950">
                    {monthName} De {year}
                  </p>
                  <p className="text-slate-400 text-sm print:text-slate-500 print:text-xs">
                    {resumen.ventasRegistradas} {resumen.ventasRegistradas === 1 ? 'venta registrada' : 'ventas registradas'}
                  </p>
                </div>
              </div>

              <div className="p-8">
                {activeTab === "resumen" ? (
                  <div className="space-y-10">
                    
                    <section className="print:break-inside-avoid print:py-4">
                      <h3 className="text-sm font-bold text-[#0367A6] tracking-wider mb-4 border-b border-[#0367A6] pb-2">
                        INGRESOS DE LA AGENCIA
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-slate-600">
                          <div>
                            <p className="font-medium text-slate-800">Ganancia neta en ventas</p>
                            <p className="text-xs text-slate-400">
                              Diferencia entre ventas brutas ({formatCurrency(resumen.totalVentasBrutas)}) y costo neto ({formatCurrency(resumen.costoServiciosNeto)})
                            </p>
                          </div>
                          <span className="font-semibold text-slate-900">{formatCurrency(resumen.gananciaNetaVentas)}</span>
                        </div>

                        <div className="flex justify-between items-start text-slate-600">
                          <div>
                            <p className="font-medium text-slate-800">Comisiones ganadas del operador (+)</p>
                            <p className="text-xs text-slate-400">Comisiones adicionales pagadas por proveedores/operadores</p>
                          </div>
                          <span className="font-semibold text-emerald-600">+{formatCurrency(resumen.comisionOperadoresTotal)}</span>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900 text-lg">
                          <div>
                            <p>Total ingresos de la agencia</p>
                            <p className="text-xs font-normal text-slate-400">Ganancia de ventas + comisiones del operador</p>
                          </div>
                          <span className="text-[#0367A6]">{formatCurrency(resumen.totalIngresosAgencia)}</span>
                        </div>
                      </div>
                    </section>

                    <section className="print:break-inside-avoid print:py-4">
                      <h3 className="text-sm font-bold text-red-500 tracking-wider mb-4 border-b border-red-500 pb-2">
                        GASTOS OPERACIONALES
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-semibold">Gastos fijos confirmados</span>
                          <span className="font-semibold text-red-500">{formatCurrency(resumen.gastosFijosConfirmados)}</span>
                        </div>
                        {resumen.detallesGastosFijos.length > 0 && (
                          <div className="pl-4 space-y-2 border-l-2 border-slate-100 py-1">
                            {resumen.detallesGastosFijos.map((gasto, index) => (
                              <div key={index} className="flex justify-between items-center text-sm text-slate-500">
                                <span>{gasto.descripcion}</span>
                                <span>{formatCurrency(gasto.monto)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center text-slate-600">
                          <span className="font-semibold">Gastos variables</span>
                          <span className="font-semibold text-red-500">{formatCurrency(resumen.gastosVariables)}</span>
                        </div>
                        {resumen.detallesGastosVariables.length > 0 && (
                          <div className="pl-4 space-y-2 border-l-2 border-slate-100 py-1">
                            {resumen.detallesGastosVariables.map((gasto, index) => (
                              <div key={index} className="flex justify-between items-center text-sm text-slate-500">
                                <span>{gasto.descripcion}</span>
                                <span>{formatCurrency(gasto.monto)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center font-bold text-slate-800">
                          <span>Total gastos operacionales</span>
                          <span className="text-red-600">{formatCurrency(resumen.totalGastosOperacionales)}</span>
                        </div>
                      </div>
                    </section>

                    <section className="mt-8 bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 print:border-emerald-500/20 print:bg-emerald-50/10 print:break-inside-avoid">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-emerald-800">Utilidad Neta</h3>
                          <p className="text-emerald-600/80 text-sm">Total ingresos de la agencia menos gastos operacionales</p>
                        </div>
                        <span className={`text-3xl font-black ${resumen.utilidadNeta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(resumen.utilidadNeta)}
                        </span>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <section className="print:break-inside-avoid print:py-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                        <h3 className="text-sm font-bold text-[#0367A6] tracking-wider uppercase">
                          1. Detalle de Ventas e Ingresos
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {ventasDetalle.length} {ventasDetalle.length === 1 ? 'registro' : 'registros'}
                        </span>
                      </div>

                      {ventasDetalle.length === 0 ? (
                        <p className="text-center text-slate-400 py-8 text-sm">No hay ventas registradas en este período.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 print:bg-slate-50 print:border-b-2 print:border-slate-300">
                                <th className="py-3 px-2">RECIBO</th>
                                <th className="py-3 px-2">CLIENTE</th>
                                <th className="py-3 px-2 text-right">MONTO BRUTO</th>
                                <th className="py-3 px-2 text-right">COSTO NETO</th>
                                <th className="py-3 px-2 text-right">GANANCIA VENTA</th>
                                <th className="py-3 px-2 text-right">COMISIÓN (+)</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 print:divide-slate-200">
                              {ventasDetalle.map((venta) => (
                                <tr key={venta.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-2 font-medium text-slate-700">{venta.recibo}</td>
                                  <td className="py-3.5 px-2 text-slate-600 max-w-[200px] leading-snug">
                                    {venta.cliente}
                                  </td>
                                  <td className="py-3.5 px-2 text-right font-medium text-slate-700">
                                    {formatCurrency(venta.montoBruto)}
                                  </td>
                                  <td className="py-3.5 px-2 text-right text-slate-500">
                                    {formatCurrency(venta.montoNeto)}
                                  </td>
                                  <td className="py-3.5 px-2 text-right font-semibold text-[#0367A6]">
                                    {formatCurrency(venta.gananciaNeta)}
                                  </td>
                                  <td className="py-3.5 px-2 text-right font-medium text-emerald-600">
                                    {venta.comisionOperador > 0 ? `+${formatCurrency(venta.comisionOperador)}` : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-slate-200 font-semibold text-sm text-slate-800">
                                <td colSpan={2} className="py-3 px-2">Total Ingresos de Ventas</td>
                                <td className="py-3 px-2 text-right">{formatCurrency(resumen.totalVentasBrutas)}</td>
                                <td className="py-3 px-2 text-right text-slate-500">{formatCurrency(resumen.costoServiciosNeto)}</td>
                                <td className="py-3 px-2 text-right text-[#0367A6]">{formatCurrency(resumen.gananciaNetaVentas)}</td>
                                <td className="py-3 px-2 text-right text-emerald-600">+{formatCurrency(resumen.comisionOperadoresTotal)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </section>

                    <section className="print:break-inside-avoid print:py-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                        <h3 className="text-sm font-bold text-red-500 tracking-wider uppercase">
                          2. Detalle de Gastos Fijos Confirmados
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {gastosFijosDetalle.length} {gastosFijosDetalle.length === 1 ? 'registro' : 'registros'}
                        </span>
                      </div>

                      {gastosFijosDetalle.length === 0 ? (
                        <p className="text-center text-slate-400 py-6 text-sm">No hay gastos fijos confirmados en este período.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 print:bg-slate-50 print:border-b-2 print:border-slate-300">
                                <th className="py-3 px-2">CONCEPTO</th>
                                <th className="py-3 px-2">CATEGORÍA</th>
                                <th className="py-3 px-2">FECHA</th>
                                <th className="py-3 px-2 text-right">MONTO</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 print:divide-slate-200">
                              {gastosFijosDetalle.map((gasto) => (
                                <tr key={gasto.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-2 font-medium text-slate-700">{gasto.descripcion}</td>
                                  <td className="py-3.5 px-2 text-slate-500">{gasto.categoria}</td>
                                  <td className="py-3.5 px-2 text-slate-400 text-xs">{gasto.fecha || "—"}</td>
                                  <td className="py-3.5 px-2 text-right font-semibold text-red-500">
                                    {formatCurrency(gasto.monto)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-slate-200 font-semibold text-sm text-slate-800">
                                <td colSpan={3} className="py-3 px-2">Subtotal Gastos Fijos</td>
                                <td className="py-3 px-2 text-right text-red-600">{formatCurrency(resumen.gastosFijosConfirmados)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </section>

                    <section className="print:break-inside-avoid print:py-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                        <h3 className="text-sm font-bold text-red-500 tracking-wider uppercase">
                          3. Detalle de Gastos Variables
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {gastosVariablesDetalle.length} {gastosVariablesDetalle.length === 1 ? 'registro' : 'registros'}
                        </span>
                      </div>

                      {gastosVariablesDetalle.length === 0 ? (
                        <p className="text-center text-slate-400 py-6 text-sm">No hay gastos variables en este período.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 print:bg-slate-50 print:border-b-2 print:border-slate-300">
                                <th className="py-3 px-2">CONCEPTO</th>
                                <th className="py-3 px-2">CATEGORÍA</th>
                                <th className="py-3 px-2">FECHA</th>
                                <th className="py-3 px-2 text-right">MONTO</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-100 print:divide-slate-200">
                              {gastosVariablesDetalle.map((gasto) => (
                                <tr key={gasto.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-2 font-medium text-slate-700">{gasto.descripcion}</td>
                                  <td className="py-3.5 px-2 text-slate-500">{gasto.categoria}</td>
                                  <td className="py-3.5 px-2 text-slate-400 text-xs">{gasto.fecha || "—"}</td>
                                  <td className="py-3.5 px-2 text-right font-semibold text-red-500">
                                    {formatCurrency(gasto.monto)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t-2 border-slate-200 font-semibold text-sm text-slate-800">
                                <td colSpan={3} className="py-3 px-2">Subtotal Gastos Variables</td>
                                <td className="py-3 px-2 text-right text-red-600">{formatCurrency(resumen.gastosVariables)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </section>

                    <section className="bg-slate-50 rounded-xl p-6 border border-slate-200 print:bg-slate-50/50 print:break-inside-avoid">
                      <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                        4. Liquidación Final del Período
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Total Ingresos de la Agencia (Ventas + Comisiones)</span>
                          <span className="font-semibold text-slate-900">{formatCurrency(resumen.totalIngresosAgencia)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Total Gastos Operacionales (Fijos + Variables)</span>
                          <span className="font-semibold text-red-500">-{formatCurrency(resumen.totalGastosOperacionales)}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center font-bold text-base">
                          <span className="text-slate-900">Utilidad Neta del Período</span>
                          <span className={`text-xl font-black ${resumen.utilidadNeta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(resumen.utilidadNeta)}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </div>
              
              <div className="hidden print:flex justify-between items-center text-xs text-slate-400 mt-12 p-8 pt-0">
                <span>Generado el {formattedDate}</span>
                <span>Viajes Primavera - Documento interno</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 print:hidden">
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-6">FLUJO FINANCIERO</h3>
              
              <div className="space-y-5">
                {(() => {
                  const maxVal = Math.max(
                    resumen.gananciaNetaVentas,
                    resumen.comisionOperadoresTotal,
                    resumen.totalIngresosAgencia,
                    resumen.totalGastosOperacionales,
                    resumen.utilidadNeta,
                    1
                  );
                  return (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600">Ganancia Ventas</span>
                          <span className="font-bold text-[#0367A6]">{formatCurrency(resumen.gananciaNetaVentas)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-[#0367A6] h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round((resumen.gananciaNetaVentas / maxVal) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600">Comisiones (+)</span>
                          <span className="font-bold text-emerald-500">{formatCurrency(resumen.comisionOperadoresTotal)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.max(Math.round((resumen.comisionOperadoresTotal / maxVal) * 100), 2)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600">Gastos Fijos (-)</span>
                          <span className="font-bold text-red-500">{formatCurrency(resumen.gastosFijosConfirmados)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round((resumen.gastosFijosConfirmados / maxVal) * 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600">Gastos Variables (-)</span>
                          <span className="font-bold text-red-400">{formatCurrency(resumen.gastosVariables)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-red-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.max(Math.round((resumen.gastosVariables / maxVal) * 100), 1)}%` }}></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-900 font-semibold">Utilidad Neta</span>
                          <span className={`font-bold ${resumen.utilidadNeta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(resumen.utilidadNeta)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className={`h-2 rounded-full transition-all duration-500 ${resumen.utilidadNeta >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.max(Math.round((Math.abs(resumen.utilidadNeta) / maxVal) * 100), 1)}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
              <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-8 w-full text-left">MARGEN NETO</h3>
              
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className={resumen.margenNeto >= 0 ? 'text-emerald-500' : 'text-red-500'}
                    strokeDasharray={`${Math.abs(resumen.margenNeto)}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.6s ease' }}
                  />
                </svg>
                
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${resumen.margenNeto >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {resumen.margenNeto}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium mt-1">de rentabilidad</span>
                </div>
              </div>
              
              <p className="text-center text-sm text-slate-500 mt-6 max-w-[200px]">
                {resumen.margenNeto >= 0
                  ? `El ${resumen.margenNeto}% de los ingresos brutos de la agencia se convierte en utilidad neta final.`
                  : `La agencia tiene una pérdida del ${Math.abs(resumen.margenNeto)}% sobre sus ingresos.`
                }
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
