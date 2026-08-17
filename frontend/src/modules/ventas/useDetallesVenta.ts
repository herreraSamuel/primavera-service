import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { detalleVentaService } from "@/services/detalle-venta.service";
import { catalogoService } from "@/services/catalogo.service";
import type { CreateDetalleVentaDTO } from "@agency/shared";

export const useDetallesVenta = (ventaId?: number | string) => {
    const queryClient = useQueryClient();

    const detallesQuery = useQuery({
        queryKey: ["detalles-venta", ventaId],
        queryFn: () => detalleVentaService.getByVentaId(ventaId!),
        enabled: !!ventaId,
    });

    const serviciosQuery = useQuery({
        queryKey: ["catalogos", "servicios"],
        queryFn: catalogoService.getServicios,
    });

    const paisesQuery = useQuery({
        queryKey: ["catalogos", "paises"],
        queryFn: catalogoService.getPaises,
    });

    const aerolineasQuery = useQuery({
        queryKey: ["catalogos", "aerolineas"],
        queryFn: catalogoService.getAerolineas,
    });

    const proveedoresQuery = useQuery({
        queryKey: ["catalogos", "proveedores"],
        queryFn: catalogoService.getProveedores,
    });

    const createDetallesBulk = useMutation({
        mutationFn: (items: CreateDetalleVentaDTO[]) => detalleVentaService.createMany(items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detalles-venta", ventaId] });
        },
    });

    const updateDetalle = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string | number;
            data: Partial<CreateDetalleVentaDTO>;
        }) => detalleVentaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detalles-venta", ventaId] });
        },
    });

    const deleteDetalle = useMutation({
        mutationFn: detalleVentaService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["detalles-venta", ventaId] });
        },
    });

    return {
        detallesQuery,
        serviciosQuery,
        paisesQuery,
        aerolineasQuery,
        proveedoresQuery,
        createDetallesBulk,
        updateDetalle,
        deleteDetalle,
    };
};
