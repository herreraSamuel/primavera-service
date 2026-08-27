import { api } from "@/lib/api";
import type { Venta, CreateVentaDTO, PaginatedResponse } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface EstadisticasVentas {
    total_bruto: number;
    total_neto: number;
    comision_total: number;
    ganancia_total: number;
    ventas_count: number;
}

export interface EstadisticasFilters {
    startDate?: string;
    endDate?: string;
    mes?: number;
    anio?: number;
}

export const ventasService = {
    getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Venta>> => {
        let url = `/ventas?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        const { data } = await api.get<PaginatedResponse<Venta>>(url);
        return data;
    },

    getById: async (id: number | string): Promise<Venta> => {
        const { data } = await api.get<ApiResponse<Venta>>(`/ventas/${id}`);
        return data.data;
    },

    create: async (ventaData: CreateVentaDTO): Promise<Venta> => {
        const { data } = await api.post<ApiResponse<Venta>>("/ventas", ventaData);
        return data.data;
    },

    update: async (
        id: number | string,
        ventaData: Partial<CreateVentaDTO>
    ): Promise<Venta> => {
        const { data } = await api.patch<ApiResponse<Venta>>(`/ventas/${id}`, ventaData);
        return data.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/ventas/${id}`);
    },

    getEstadisticas: async (filters?: EstadisticasFilters): Promise<EstadisticasVentas> => {
        const params = new URLSearchParams();

        if (filters?.startDate) params.append("startDate", filters.startDate);
        if (filters?.endDate) params.append("endDate", filters.endDate);
        if (filters?.mes) params.append("mes", String(filters.mes));
        if (filters?.anio) params.append("anio", String(filters.anio));

        const queryString = params.toString();
        const url = `/ventas/estadisticas${queryString ? `?${queryString}` : ""}`;
        const { data } = await api.get<ApiResponse<EstadisticasVentas>>(url);
        return data.data;
    },
};

