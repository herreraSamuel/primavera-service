"use client";

import { useClients } from "../hooks/useClients";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { ClientFormModal } from "./ClientFormModal";
import type { Client } from "@agency/shared";

export default function ClientTable() {
    const { clientsQuery, deleteClient } = useClients();
    const [deletingClientId, setDeletingClientId] = useState<string | number | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    if (clientsQuery.isLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando clientes...</div>;
    }

    if (clientsQuery.isError) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
                Error al cargar los clientes. ¿Está encendido el servidor backend?
            </div>
        );
    }

    const clients = clientsQuery.data || [];
    const clientToDelete = clients.find(c => c.id === deletingClientId);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                            <th className="px-6 py-4 font-semibold">Documento / NIT</th>
                            <th className="px-6 py-4 font-semibold">Correo</th>
                            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No hay clientes registrados aún.
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {client.primer_nombre} {client.primer_apellido}
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.documento_identidad || client.nit || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.correo_electronico || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        <button 
                                            onClick={() => setEditingClient(client)}
                                            className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeletingClientId(client.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {clientToDelete && (
                <ConfirmDeleteModal
                    isOpen={!!deletingClientId}
                    onClose={() => setDeletingClientId(null)}
                    onConfirm={() => {
                        deleteClient.mutate(clientToDelete.id, {
                            onSuccess: () => setDeletingClientId(null)
                        });
                    }}
                    isPending={deleteClient.isPending}
                    clientName={`${clientToDelete.primer_nombre} ${clientToDelete.primer_apellido}`}
                />
            )}

            <ClientFormModal 
                isOpen={!!editingClient}
                onClose={() => setEditingClient(null)}
                clientToEdit={editingClient}
            />
        </div>
    );
}