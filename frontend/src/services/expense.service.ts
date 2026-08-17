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

export const expenseService = {
    getMonthlySummary: async (month: number, year: number): Promise<MonthlyExpenseData> => {
        const { data } = await api.get<ApiResponse<MonthlyExpenseData>>(`/gastos/summary`, {
            params: { month, year }
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
