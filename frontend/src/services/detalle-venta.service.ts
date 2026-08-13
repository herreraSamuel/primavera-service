import { api } from "@/lib/api";
import type { DetalleVenta, CreateDetalleVentaDTO } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const detalleVentaService = {
    getByVentaId: async (ventaId: number | string): Promise<DetalleVenta[]> => {
        const { data } = await api.get<ApiResponse<DetalleVenta[]>>(`/detalles-venta/venta/${ventaId}`);
        return data.data;
    },

    createMany: async (items: CreateDetalleVentaDTO[]): Promise<DetalleVenta[]> => {
        const { data } = await api.post<ApiResponse<DetalleVenta[]>>("/detalles-venta/bulk", { items });
        return data.data;
    },

    update: async (
        id: number | string,
        detalleData: Partial<CreateDetalleVentaDTO>
    ): Promise<DetalleVenta> => {
        const { data } = await api.patch<ApiResponse<DetalleVenta>>(`/detalles-venta/${id}`, detalleData);
        return data.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/detalles-venta/${id}`);
    },
};
