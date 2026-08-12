"use client";

import ClientTable from "@/modules/clients/ClientTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ClientFormModal } from "@/modules/clients/ClientFormModal";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ClientesPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clientes"
                description="Gestión del directorio de viajeros y agencias."
                action={
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Nuevo Cliente
                    </button>
                }
            />

            <ClientTable />

            <ClientFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}