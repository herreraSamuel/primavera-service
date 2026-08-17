import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
    const [month, setMonth] = useState<number>(now.getMonth() + 1);
    const [year, setYear] = useState<number>(now.getFullYear());

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["expenses", "summary", month, year],
        queryFn: () => expenseService.getMonthlySummary(month, year)
    });

    const confirmExpenseMutation = useMutation({
        mutationFn: ({ catalogo_gasto_id, monto }: { catalogo_gasto_id: number; monto: number }) => 
            expenseService.confirmFixedExpense(catalogo_gasto_id, monto),
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

    return {
        data: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        month,
        setMonth,
        year,
        setYear,
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
