import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ventasService } from "@/services/venta.service";
import { clientsService } from "@/services/client.service";
import type { CreateVentaDTO } from "@agency/shared";

export const useVentas = (page: number = 1, limit: number = 10, search?: string) => {
    const queryClient = useQueryClient();

    const ventasQuery = useQuery({
        queryKey: ["ventas", page, limit, search],
        queryFn: () => ventasService.getAll(page, limit, search),
    });

    const useVentaQuery = (id: string | number) =>
        useQuery({
            queryKey: ["ventas", id],
            queryFn: () => ventasService.getById(id),
            enabled: !!id,
        });

    const clientsQuery = useQuery({
        queryKey: ["clients", "all"],
        queryFn: () => clientsService.getAll(1, 100),
    });

    const createVenta = useMutation({
        mutationFn: ventasService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ventas"] });
        },
    });

    const updateVenta = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string | number;
            data: Partial<CreateVentaDTO>;
        }) => ventasService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ventas"] });
        },
    });

    const deleteVenta = useMutation({
        mutationFn: ventasService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ventas"] });
        },
    });

    return {
        ventasQuery,
        useVentaQuery,
        clientsQuery,
        createVenta,
        updateVenta,
        deleteVenta,
    };
};
