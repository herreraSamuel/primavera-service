import { api } from "@/lib/api";
import type { EstadoResultadosData } from "@/modules/estado-resultados/types";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const estadoResultadosService = {
    getResumen: async (month: number, year: number): Promise<EstadoResultadosData> => {
        const { data } = await api.get<ApiResponse<EstadoResultadosData>>(`/estado-resultados`, {
            params: { month, year }
        });
        return data.data;
    },
};
