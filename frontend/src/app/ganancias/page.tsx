"use client";

import { useEstadisticasVentas } from "@/modules/ganancias/useEstadisticasVentas";
import { PageHeader } from "@/components/ui/PageHeader";
import { TrendingUp, Receipt, DollarSign, BarChart3 } from "lucide-react";

export default function GananciasPage() {
    const {
        totalBrutoFormatted,
        gananciaTotalFormatted,
        comisionTotalFormatted,
        ventasCount,
        filterMode,
        setFilterMode,
        mes,
        setMes,
        anio,
        setAnio,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        isLoading,
        MESES,
        ANIOS,
    } = useEstadisticasVentas();

    const setPreset = (months: number) => {
        const now = new Date();
        const start = new Date(now);
        start.setMonth(start.getMonth() - months);
        setFilterMode("rango");
        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Ganancias"
                description="Análisis de ingresos, ganancia neta y comisiones del operador."
                action={
                    <div className="flex items-center gap-3">
                        <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value as "mes" | "rango")}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
                        >
                            <option value="mes">Mensual</option>
                            <option value="rango">Rango Personalizado</option>
                        </select>

                        {filterMode === "mes" ? (
                            <div className="flex items-center gap-2">
                                <select
                                    value={mes}
                                    onChange={(e) => setMes(Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
                                >
                                    {MESES.map((nombreMes, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {nombreMes}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={anio}
                                    onChange={(e) => setAnio(Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
                                >
                                    {ANIOS.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                                <span className="text-slate-400">—</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                />
                            </div>
                        )}

                        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
                            {[
                                { label: "3M", months: 3 },
                                { label: "6M", months: 6 },
                                { label: "1A", months: 12 },
                            ].map(({ label, months }) => (
                                <button
                                    key={label}
                                    onClick={() => setPreset(months)}
                                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border-r last:border-r-0 border-slate-200"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-xl border border-slate-200 border-t-[3px] border-t-emerald-500 p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            INGRESOS TOTALES
                        </span>
                        <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                            <DollarSign className="w-5 h-5" />
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            {totalBrutoFormatted}
                        </span>
                    )}
                    <span className="text-sm text-slate-400">Monto recibo acumulado</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 border-t-[3px] border-t-blue-500 p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            GANANCIA NETA
                        </span>
                        <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                            <BarChart3 className="w-5 h-5" />
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            {gananciaTotalFormatted}
                        </span>
                    )}
                    <span className="text-sm text-slate-400">Después de costos</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 border-t-[3px] border-t-amber-500 p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            COMISIONES
                        </span>
                        <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                            <TrendingUp className="w-5 h-5" />
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            {comisionTotalFormatted}
                        </span>
                    )}
                    <span className="text-sm text-slate-400">Ganancia del operador</span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 border-t-[3px] border-t-slate-400 p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            VENTAS CERRADAS
                        </span>
                        <span className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                            <Receipt className="w-5 h-5" />
                        </span>
                    </div>
                    {isLoading ? (
                        <div className="h-9 w-28 bg-slate-200 rounded animate-pulse" />
                    ) : (
                        <span className="text-3xl font-bold text-slate-900 tracking-tight">
                            {ventasCount}
                        </span>
                    )}
                    <span className="text-sm text-slate-400">Recibos emitidos</span>
                </div>
            </div>
        </div>
    );
}
