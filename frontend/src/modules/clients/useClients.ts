import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "@/services/client.service";
import { departamentoService } from "@/services/departamento.service";
import type { CreateClientDTO } from "@agency/shared";


export const useClients = (page: number = 1, limit: number = 10, search?: string) => {
    const queryClient = useQueryClient();

    const clientsQuery = useQuery({
        queryKey: ["clients", page, limit, search],
        queryFn: () => clientsService.getAll(page, limit, search),
    });

    const useClientQuery = (id: string | number) =>
        useQuery({
            queryKey: ["clients", id],
            queryFn: () => clientsService.getById(id),
            enabled: !!id,
        });

    const departamentosQuery = useQuery({
        queryKey: ["departamentos"],
        queryFn: departamentoService.getAll,
    });

    const createClient = useMutation({
        mutationFn: clientsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });

    const updateClient = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string | number;
            data: Partial<CreateClientDTO>;
        }) => clientsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });

    const deleteClient = useMutation({
        mutationFn: clientsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
    });

    return {
        clientsQuery,
        useClientQuery,
        departamentosQuery,
        createClient,
        updateClient,
        deleteClient,
    };
};