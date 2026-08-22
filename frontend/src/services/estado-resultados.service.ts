import { api } from "@/lib/api";
import type { EstadoResultadosData } from "@/modules/estado-resultados/types";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface EstadoResultadosFilters {
    month?: number;
    year?: number;
    startDate?: string;
    endDate?: string;
}

export const estadoResultadosService = {
    getResumen: async (filtersOrMonth?: EstadoResultadosFilters | number, maybeYear?: number): Promise<EstadoResultadosData> => {
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

        const { data } = await api.get<ApiResponse<EstadoResultadosData>>(`/estado-resultados`, {
            params
        });
        return data.data;
    },
};
