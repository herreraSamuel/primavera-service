import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { estadoResultadosService } from "@/services/estado-resultados.service";

export const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function formatCurrency(value: number): string {
    return "Q" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const useEstadoResultados = () => {
    const now = new Date();
    const [month, setMonth] = useState<number>(now.getMonth() + 1);
    const [year, setYear] = useState<number>(now.getFullYear());

    const query = useQuery({
        queryKey: ["estado-resultados", month, year],
        queryFn: () => estadoResultadosService.getResumen(month, year),
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

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        month,
        setMonth,
        year,
        setYear,
        goToPreviousMonth,
        goToNextMonth,
        monthName: MONTHS[month - 1],
        formatCurrency,
        MONTHS,
    };
};
