import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ventasService } from "@/services/venta.service";

function formatCurrency(value: number): string {
    return "Q" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ANIOS = Array.from({ length: 11 }, (_, i) => 2020 + i);

export const useEstadisticasVentas = () => {
    const now = new Date();
    const [filterMode, setFilterMode] = useState<"mes" | "rango">("mes");
    const [mes, setMes] = useState<number>(now.getMonth() + 1);
    const [anio, setAnio] = useState<number>(now.getFullYear());
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState<string>(() => {
        return now.toISOString().split("T")[0];
    });

    const filters = useMemo(() => {
        if (filterMode === "mes") {
            return { mes, anio };
        }
        return { startDate, endDate };
    }, [filterMode, mes, anio, startDate, endDate]);

    const query = useQuery({
        queryKey: ["ventas", "estadisticas", filters],
        queryFn: () => ventasService.getEstadisticas(filters)
    });

    const totalBruto = query.data?.total_bruto ?? 0;
    const totalNeto = query.data?.total_neto ?? 0;
    const comisionTotal = query.data?.comision_total ?? 0;
    const gananciaTotal = query.data?.ganancia_total ?? 0;
    const ventasCount = query.data?.ventas_count ?? 0;

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        totalBrutoFormatted: formatCurrency(totalBruto),
        totalNetoFormatted: formatCurrency(totalNeto),
        comisionTotalFormatted: formatCurrency(comisionTotal),
        gananciaTotalFormatted: formatCurrency(gananciaTotal),
        ventasCount,
        totalBruto,
        totalNeto,
        comisionTotal,
        gananciaTotal,
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
        MESES,
        ANIOS,
        formatCurrency
    };
};
