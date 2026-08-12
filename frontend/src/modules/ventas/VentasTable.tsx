"use client";

import { useVentas } from "./useVentas";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { VentaFormModal } from "./VentaFormModal";
import type { Venta } from "@agency/shared";
import { DataTable, type Column } from "@/components/ui/DataTable";

export default function VentasTable() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { ventasQuery, deleteVenta } = useVentas(page, limit);
    const [deletingVentaId, setDeletingVentaId] = useState<string | number | null>(null);
    const [editingVenta, setEditingVenta] = useState<Venta | null>(null);

    const ventas = ventasQuery.data?.data || [];
    const meta = ventasQuery.data?.meta;
    const ventaToDelete = ventas.find(v => v.id === deletingVentaId);

    const getMetodoPagoBadge = (metodo: string) => {
        switch (metodo) {
            case "TARJETA":
                return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">TARJETA</span>;
            case "EFECTIVO":
                return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">EFECTIVO</span>;
            case "TRANSFERENCIA":
                return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">TRANSFERENCIA</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{metodo}</span>;
        }
    };

    const columns: Column<Venta>[] = [
        {
            key: "numero_recibo",
            header: "No. Recibo",
            className: "font-semibold text-slate-800",
            render: (venta) => venta.numero_recibo,
        },
        {
            key: "fecha",
            header: "Fecha",
            render: (venta) => new Date(venta.fecha_venta).toLocaleDateString(),
        },
        {
            key: "cliente",
            header: "Cliente",
            render: (venta) => venta.clientes ? `${venta.clientes.primer_nombre} ${venta.clientes.primer_apellido}` : "—",
        },
        {
            key: "metodo_pago",
            header: "Método Pago",
            render: (venta) => getMetodoPagoBadge(venta.metodo_pago),
        },
        {
            key: "monto_recibo",
            header: "Monto",
            className: "text-slate-600 font-medium",
            render: (venta) => `Q${Number(venta.monto_recibo).toFixed(2)}`,
        },
        {
            key: "monto_neto",
            header: "Monto Neto",
            className: "text-slate-500",
            render: (venta) => `Q${Number(venta.monto_neto).toFixed(2)}`,
        },
        {
            key: "acciones",
            header: "Acciones",
            headerClassName: "text-right",
            className: "flex justify-end gap-2",
            render: (venta) => (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingVenta(venta);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Editar venta"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeletingVentaId(venta.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Eliminar venta"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            ),
        },
    ];

    const filtersSlot = (
        <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-between">
            <div className="relative flex-grow max-w-md">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input 
                    type="text" 
                    placeholder="Buscar por recibo..." 
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                />
            </div>
            <div className="flex gap-3">
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">Método de pago</option>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                </select>
                <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option value="">Fecha</option>
                    <option value="hoy">Hoy</option>
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mes</option>
                </select>
            </div>
        </div>
    );

    return (
        <>
            <DataTable<Venta>
                data={ventas}
                columns={columns}
                isLoading={ventasQuery.isLoading}
                isError={ventasQuery.isError}
                errorMessage="Error al cargar las ventas. ¿Está encendido el servidor backend?"
                emptyMessage="No hay ventas registradas aún."
                filtersSlot={filtersSlot}
                pagination={meta ? {
                    page: meta.page,
                    limit: meta.limit,
                    total: meta.total,
                    totalPages: meta.totalPages,
                    onPageChange: setPage,
                    onLimitChange: (newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    },
                } : undefined}
            />

            {ventaToDelete && (
                <ConfirmModal
                    isOpen={!!deletingVentaId}
                    onClose={() => setDeletingVentaId(null)}
                    onConfirm={() => {
                        deleteVenta.mutate(ventaToDelete.id, {
                            onSuccess: () => setDeletingVentaId(null)
                        });
                    }}
                    isPending={deleteVenta.isPending}
                    title="¿Estás seguro?"
                    description={`¿Deseas eliminar el recibo ${ventaToDelete.numero_recibo}?`}
                    confirmText="Eliminar"
                />
            )}

            <VentaFormModal 
                isOpen={!!editingVenta}
                onClose={() => setEditingVenta(null)}
                ventaToEdit={editingVenta}
            />
        </>
    );
}
