import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Client } from "@agency/shared";

interface ClientDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
    onEdit: (client: Client) => void;
}

export function ClientDetailsModal({
    isOpen,
    onClose,
    client,
    onEdit,
}: ClientDetailsModalProps) {
    if (!client) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-8 sm:rounded-2xl border-0 shadow-2xl" showCloseButton={false}>
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {client.primer_nombre} {client.primer_apellido} {client.segundo_apellido || ''}
                    </DialogTitle>
                    <p className="text-sm text-slate-500">Detalle del cliente</p>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Nombre</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.primer_nombre}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Nombre</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.segundo_nombre || "—"}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primer Apellido</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.primer_apellido}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Segundo Apellido</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.segundo_apellido || "—"}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">NIT</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.nit || "—"}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Documento de Identidad</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.documento_identidad || "—"}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dirección</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.direccion || "—"}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teléfono</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.telefono || "—"}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.correo_electronico || "—"}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Departamento</h4>
                        <p className="text-[15px] font-medium text-slate-800">{client.departamento_id ? `Departamento ${client.departamento_id}` : "—"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onClose} 
                        className="h-12 rounded-xl text-slate-700 font-semibold border-slate-200 hover:bg-slate-50"
                    >
                        Cerrar
                    </Button>
                    <Button 
                        type="button" 
                        onClick={() => {
                            onClose();
                            onEdit(client);
                        }}
                        className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                    >
                        Editar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
