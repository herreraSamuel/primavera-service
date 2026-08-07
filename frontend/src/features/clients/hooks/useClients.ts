import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsService } from "../../services/client.service";
import type { CreateClientDTO } from "@agency/shared";


export const useClients = () => {
    const queryClient = useQueryClient();

    const clientsQuery = useQuery({
        queryKey: ["clients"],
        queryFn: clientsService.getAll,
    });

    const clientQuery = (id: string | number) =>
        useQuery({
            queryKey: ["clients", id],
            queryFn: () => clientsService.getById(id),
            enabled: !!id,
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
        clientQuery,
        createClient,
        updateClient,
        deleteClient,
    };
};