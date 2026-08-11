"use client";

import ClientTable from "@/features/clients/components/ClientTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ClientFormModal } from "@/features/clients/components/ClientFormModal";

export default function ClientesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Clientes</h1>
                    <p className="text-slate-500 text-[15px] mt-1">
                        Gestión del directorio de viajeros y agencias.
                    </p>
                </div>

                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    Nuevo Cliente
                </button>
            </div>

            <ClientTable />

            <ClientFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}