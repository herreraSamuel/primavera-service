import { api } from "@/lib/api";
import type { Servicio, Pais, Aerolinea, Proveedor } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const catalogoService = {
    getServicios: async (): Promise<Servicio[]> => {
        const { data } = await api.get<ApiResponse<Servicio[]>>("/servicios");
        return data.data;
    },

    getPaises: async (): Promise<Pais[]> => {
        const { data } = await api.get<ApiResponse<Pais[]>>("/paises");
        return data.data;
    },

    getAerolineas: async (): Promise<Aerolinea[]> => {
        const { data } = await api.get<ApiResponse<Aerolinea[]>>("/aerolineas");
        return data.data;
    },

    getProveedores: async (): Promise<Proveedor[]> => {
        const { data } = await api.get<ApiResponse<Proveedor[]>>("/operadores");
        return data.data;
    },
};
