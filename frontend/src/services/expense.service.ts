import { api } from "@/lib/api";
import { MonthlyExpenseData } from "../types/expense";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface CreateVariableExpensePayload {
    fecha: string;
    categoria: string;
    descripcion_extra?: string;
    monto: number;
}

export interface ExpenseFilters {
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
}

export const expenseService = {
    getMonthlySummary: async (filtersOrMonth?: ExpenseFilters | number, maybeYear?: number): Promise<MonthlyExpenseData> => {
        let params: Record<string, any> = {};

        if (typeof filtersOrMonth === "number") {
            params.month = filtersOrMonth;
            if (maybeYear) params.year = maybeYear;
        } else if (filtersOrMonth) {
            if (filtersOrMonth.month) params.month = filtersOrMonth.month;
            if (filtersOrMonth.year) params.year = filtersOrMonth.year;
            if (filtersOrMonth.startDate) params.startDate = filtersOrMonth.startDate;
            if (filtersOrMonth.endDate) params.endDate = filtersOrMonth.endDate;
        }

        const { data } = await api.get<ApiResponse<MonthlyExpenseData>>(`/gastos/summary`, {
            params
        });
        return data.data;
    },

    confirmFixedExpense: async (catalogo_gasto_id: number, monto: number): Promise<void> => {
        await api.post(`/gastos`, {
            catalogo_gasto_id,
            monto,
            fecha: new Date().toISOString()
        });
    },

    createVariableExpense: async (payload: CreateVariableExpensePayload): Promise<void> => {
        await api.post(`/gastos`, payload);
    },

    updateExpense: async (id: string | number, monto: number): Promise<void> => {
        await api.patch(`/gastos/${id}`, { monto });
    },

    deleteExpense: async (id: string | number): Promise<void> => {
        await api.delete(`/gastos/${id}`);
    }
};
