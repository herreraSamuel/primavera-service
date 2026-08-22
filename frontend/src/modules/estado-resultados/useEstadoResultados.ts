import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { estadoResultadosService } from "@/services/estado-resultados.service";

export const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

export function formatCurrency(value: number): string {
    return "Q" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const useEstadoResultados = () => {
    const now = new Date();
    const [filterMode, setFilterMode] = useState<"mes" | "rango">("mes");
    const [month, setMonth] = useState<number>(now.getMonth() + 1);
    const [year, setYear] = useState<number>(now.getFullYear());
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        return d.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState<string>(() => {
        return now.toISOString().split("T")[0];
    });

    const setPreset = (months: number) => {
        const current = new Date();
        const start = new Date(current);
        start.setMonth(start.getMonth() - months);
        setFilterMode("rango");
        setStartDate(start.toISOString().split("T")[0]);
        setEndDate(current.toISOString().split("T")[0]);
    };

    const filters = useMemo(() => {
        if (filterMode === "mes") {
            return { month, year };
        }
        return { startDate, endDate };
    }, [filterMode, month, year, startDate, endDate]);

    const query = useQuery({
        queryKey: ["estado-resultados", filters],
        queryFn: () => estadoResultadosService.getResumen(filters),
    });

    const goToPreviousMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(prev => prev - 1);
        } else {
            setMonth(prev => prev - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(prev => prev + 1);
        } else {
            setMonth(prev => prev + 1);
        }
    };

    const periodLabel = useMemo(() => {
        if (filterMode === "mes") {
            return `${MONTHS[month - 1]} ${year}`;
        }
        return `${startDate} al ${endDate}`;
    }, [filterMode, month, year, startDate, endDate]);

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        filterMode,
        setFilterMode,
        month,
        setMonth,
        year,
        setYear,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        setPreset,
        periodLabel,
        goToPreviousMonth,
        goToNextMonth,
        monthName: MONTHS[month - 1],
        formatCurrency,
        MONTHS,
        YEARS
    };
};
