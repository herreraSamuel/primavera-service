import { api } from "@/lib/api";
import type { Client, CreateClientDTO, PaginatedResponse } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const clientsService = {
    getAll: async (page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Client>> => {
        let url = `/clients?page=${page}&limit=${limit}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        const { data } = await api.get<PaginatedResponse<Client>>(url);
        return data;
    },

    getById: async (id: number | string): Promise<Client> => {
        const { data } = await api.get<ApiResponse<Client>>(`/clients/${id}`);
        return data.data;
    },

    create: async (clientData: CreateClientDTO): Promise<Client> => {
        const { data } = await api.post<ApiResponse<Client>>("/clients", clientData);
        return data.data;
    },

    update: async (
        id: number | string,
        clientData: Partial<CreateClientDTO>
    ): Promise<Client> => {
        const { data } = await api.patch<ApiResponse<Client>>(`/clients/${id}`, clientData);
        return data.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await api.delete(`/clients/${id}`);
    },
};