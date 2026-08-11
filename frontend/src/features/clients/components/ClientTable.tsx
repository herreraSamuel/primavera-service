"use client";

import { useClients } from "../hooks/useClients";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { ClientFormModal } from "./ClientFormModal";
import { ClientDetailsModal } from "./ClientDetailsModal";
import type { Client } from "@agency/shared";

export default function ClientTable() {
    const { clientsQuery, deleteClient } = useClients();
    const [deletingClientId, setDeletingClientId] = useState<string | number | null>(null);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [viewingClient, setViewingClient] = useState<Client | null>(null);

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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-6">
            <div className="p-5 border-b border-slate-100">
                <div className="relative max-w-sm">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Buscar cliente..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold bg-white border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Nombre Completo</th>
                            <th className="px-6 py-4 font-semibold">Doc. Identidad</th>
                            <th className="px-6 py-4 font-semibold">Correo</th>
                            <th className="px-6 py-4 font-semibold">Teléfono</th>
                            <th className="px-6 py-4 font-semibold">Dirección</th>
                            <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {clients.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No hay clientes registrados aún.
                                </td>
                            </tr>
                        ) : (
                            clients.map((client) => (
                                <tr 
                                    key={client.id} 
                                    onClick={() => setViewingClient(client)}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-5 font-semibold text-slate-800">
                                        {client.primer_nombre} {client.segundo_nombre || ''} {client.primer_apellido} {client.segundo_apellido || ''}
                                    </td>
                                    <td className="px-6 py-5 font-mono text-slate-500 text-xs">
                                        {client.documento_identidad || client.nit || "—"}
                                    </td>
                                    <td className="px-6 py-5">
                                        {client.correo_electronico ? (
                                            <a href={`mailto:${client.correo_electronico}`} className="text-[#0367A6] hover:underline" onClick={(e) => e.stopPropagation()}>
                                                {client.correo_electronico}
                                            </a>
                                        ) : "—"}
                                    </td>
                                    <td className="px-6 py-5 text-slate-500">
                                        {client.telefono || "—"}
                                    </td>
                                    <td className="px-6 py-5 text-slate-600 truncate max-w-[200px]">
                                        {client.direccion || "—"}
                                    </td>
                                    <td className="px-6 py-5 flex justify-end gap-2">
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

            <ClientDetailsModal 
                isOpen={!!viewingClient}
                onClose={() => setViewingClient(null)}
                client={viewingClient}
                onEdit={(client) => setEditingClient(client)}
            />
        </div>
    );
}