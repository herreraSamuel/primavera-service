import { api } from "@/lib/api";

export interface Departamento {
    id: number;
    nombre: string;
}

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const departamentoService = {
    getAll: async (): Promise<Departamento[]> => {
        const { data } = await api.get<ApiResponse<Departamento[]>>("/departamentos");
        return data.data;
    },
};
