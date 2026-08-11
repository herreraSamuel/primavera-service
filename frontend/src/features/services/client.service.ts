import { api } from "@/lib/api";
import type { Client, CreateClientDTO } from "@agency/shared";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const clientsService = {
    getAll: async (): Promise<Client[]> => {
        const { data } = await api.get<ApiResponse<Client[]>>("/clients");
        return data.data;
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