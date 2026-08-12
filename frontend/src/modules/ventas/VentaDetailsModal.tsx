import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Venta } from "@agency/shared";

interface VentaDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    venta: Venta | null;
    onEdit: (venta: Venta) => void;
}

export function VentaDetailsModal({
    isOpen,
    onClose,
    venta,
    onEdit,
}: VentaDetailsModalProps) {
    if (!venta) return null;

    const clienteNombre = venta.clientes 
        ? `${venta.clientes.primer_nombre} ${venta.clientes.primer_apellido}`
        : "—";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-8 sm:rounded-2xl border-0 shadow-2xl" showCloseButton={false}>
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        Recibo {venta.numero_recibo}
                    </DialogTitle>
                    <p className="text-sm text-slate-500">Detalle de la venta</p>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Número de Recibo</h4>
                        <p className="text-[15px] font-medium text-slate-800">{venta.numero_recibo}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Venta</h4>
                        <p className="text-[15px] font-medium text-slate-800">{new Date(venta.fecha_venta).toLocaleDateString()}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cliente</h4>
                        <p className="text-[15px] font-medium text-slate-800">{clienteNombre}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Método de Pago</h4>
                        <p className="text-[15px] font-medium text-slate-800">{venta.metodo_pago}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monto del Recibo</h4>
                        <p className="text-[15px] font-medium text-slate-800">Q{Number(venta.monto_recibo).toFixed(2)}</p>
                    </div>
                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monto Neto</h4>
                        <p className="text-[15px] font-medium text-slate-800">Q{Number(venta.monto_neto).toFixed(2)}</p>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Comisión Operador</h4>
                        <p className="text-[15px] font-medium text-slate-800">
                            {venta.comision_operador !== null ? `Q${Number(venta.comision_operador).toFixed(2)}` : "—"}
                        </p>
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
                            onEdit(venta);
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
