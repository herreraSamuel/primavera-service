import { api } from "@/lib/api";
import type { Venta, CreateVentaDTO, PaginatedResponse } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const ventasService = {
    getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Venta>> => {
        let url = `/ventas?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        const { data } = await api.get<ApiResponse<PaginatedResponse<Venta>>>(url);
        return data.data;
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
};
