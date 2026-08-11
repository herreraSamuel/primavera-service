"use client";

import { useClients } from "./useClients";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ClientFormModal } from "./ClientFormModal";
import { ClientDetailsModal } from "./ClientDetailsModal";
import type { Client } from "@agency/shared";
import { DataTable, type Column } from "@/components/ui/DataTable";

export default function ClientTable() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { clientsQuery, deleteClient } = useClients(page, limit);
    const [deletingClientId, setDeletingClientId] = useState<string | number | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [viewingClient, setViewingClient] = useState<Client | null>(null);

    const clients = clientsQuery.data?.data || [];
    const meta = clientsQuery.data?.meta;
    const clientToDelete = clients.find(c => c.id === deletingClientId);

    const columns: Column<Client>[] = [
        {
            key: "nombre",
            header: "Nombre Completo",
            className: "font-semibold text-slate-800",
            render: (client) =>
                `${client.primer_nombre} ${client.segundo_nombre || ''} ${client.primer_apellido} ${client.segundo_apellido || ''}`,
        },
        {
            key: "documento",
            header: "Doc. Identidad",
            className: "font-mono text-slate-500 text-xs",
            render: (client) => client.documento_identidad || client.nit || "—",
        },
        {
            key: "correo",
            header: "Correo",
            render: (client) =>
                client.correo_electronico ? (
                    <a
                        href={`mailto:${client.correo_electronico}`}
                        className="text-[#0367A6] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {client.correo_electronico}
                    </a>
                ) : (
                    "—"
                ),
        },
        {
            key: "telefono",
            header: "Teléfono",
            className: "text-slate-500",
            render: (client) => client.telefono || "—",
        },
        {
            key: "direccion",
            header: "Dirección",
            className: "text-slate-600 truncate max-w-[200px]",
            render: (client) => client.direccion || "—",
        },
        {
            key: "acciones",
            header: "Acciones",
            headerClassName: "text-right",
            className: "flex justify-end gap-2",
            render: (client) => (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Editar cliente"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeletingClientId(client.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Eliminar cliente"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </>
            ),
        },
    ];

    const searchFilter = (
        <div className="relative flex-grow max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
        </div>
    );

    return (
        <>
            <DataTable<Client>
                data={clients}
                columns={columns}
                isLoading={clientsQuery.isLoading}
                isError={clientsQuery.isError}
                errorMessage="Error al cargar los clientes. ¿Está encendido el servidor backend?"
                emptyMessage="No hay clientes registrados aún."
                onRowClick={(client) => setViewingClient(client)}
                filtersSlot={searchFilter}
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

            {clientToDelete && (
                <ConfirmModal
                    isOpen={!!deletingClientId}
                    onClose={() => setDeletingClientId(null)}
                    onConfirm={() => {
                        deleteClient.mutate(clientToDelete.id, {
                            onSuccess: () => setDeletingClientId(null)
                        });
                    }}
                    isPending={deleteClient.isPending}
                    title="¿Estás seguro?"
                    description={`¿Deseas eliminar a ${clientToDelete.primer_nombre} ${clientToDelete.primer_apellido}?`}
                    confirmText="Eliminar"
                />
            )}

            <ClientFormModal 
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                clientToEdit={editingClient}
            />

            <ClientDetailsModal 
                isOpen={!!viewingClient}
                onClose={() => setViewingClient(null)}
                client={viewingClient}
                onEdit={(client) => setEditingClient(client)}
            />
        </>
    );
}