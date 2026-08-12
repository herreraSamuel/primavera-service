"use client";

import VentasTable from "@/modules/ventas/VentasTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { VentaFormModal } from "@/modules/ventas/VentaFormModal";
import { PageHeader } from "@/components/ui/PageHeader";

export default function VentasPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Ventas"
                description="Registro de recibos y transacciones de venta."
                action={
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Nueva Venta
                    </button>
                }
            />

            <VentasTable />

            <VentaFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}
