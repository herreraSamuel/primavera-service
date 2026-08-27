import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { expenseService, CreateVariableExpensePayload } from "@/services/expense.service";

export function formatCurrency(value: number): string {
    return "Q" + value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const YEARS = Array.from({ length: 11 }, (_, i) => 2020 + i);

export const useExpenses = () => {
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

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["expenses", "summary", filters],
        queryFn: () => expenseService.getMonthlySummary(filters)
    });

    const confirmExpenseMutation = useMutation({
        mutationFn: ({ catalogo_gasto_id, monto }: { catalogo_gasto_id: number; monto: number }) => {
            let targetDate = new Date();
            if (filterMode === "mes") {
                const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();
                if (!isCurrentMonth) {
                    targetDate = new Date(year, month - 1, 15, 12, 0, 0);
                }
            } else {
                const start = new Date(startDate + "T12:00:00");
                const end = new Date(endDate + "T12:00:00");
                if (now < start || now > end) {
                    targetDate = new Date(start.getTime() + (end.getTime() - start.getTime()) / 2);
                }
            }
            return expenseService.confirmFixedExpense(catalogo_gasto_id, monto, targetDate.toISOString());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
        }
    });

    const createVariableMutation = useMutation({
        mutationFn: (payload: CreateVariableExpensePayload) => 
            expenseService.createVariableExpense(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
        }
    });

    const updateExpenseMutation = useMutation({
        mutationFn: ({ id, monto }: { id: string | number; monto: number }) => 
            expenseService.updateExpense(id, monto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
        }
    });

    const deleteExpenseMutation = useMutation({
        mutationFn: (id: string | number) => 
            expenseService.deleteExpense(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", "summary"] });
        }
    });

    const periodLabel = useMemo(() => {
        if (filterMode === "mes") {
            return `${MONTHS[month - 1]} de ${year}`;
        }
        return `${startDate} al ${endDate}`;
    }, [filterMode, month, year, startDate, endDate]);

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
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
        confirmExpense: confirmExpenseMutation.mutate,
        isConfirming: confirmExpenseMutation.isPending,
        createVariableExpense: createVariableMutation.mutate,
        isCreatingVariable: createVariableMutation.isPending,
        updateExpense: updateExpenseMutation.mutate,
        isUpdating: updateExpenseMutation.isPending,
        deleteExpense: deleteExpenseMutation.mutate,
        isDeleting: deleteExpenseMutation.isPending,
        formatCurrency,
        MONTHS,
        YEARS
    };
};
