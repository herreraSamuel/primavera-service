import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X, Plane, Hotel, Plus, Users } from "lucide-react";
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
}: VentaDetailsModalProps) {
    if (!venta) return null;

    const clienteNombre = venta.clientes 
        ? `${venta.clientes.primer_nombre} ${venta.clientes.primer_apellido}`
        : "—";

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
                <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 w-full max-w-[750px] bg-slate-50 shadow-2xl flex flex-col data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right duration-300 outline-none">
                    
                    <div className="bg-[#0f172a] text-white p-8 pb-6 shrink-0 relative">
                        <DialogPrimitive.Close className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors cursor-pointer outline-none">
                            <X className="w-6 h-6" />
                        </DialogPrimitive.Close>
                        
                        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-2">Detalle de Venta</p>
                        <h2 className="text-3xl font-bold mb-1 text-white">{venta.numero_recibo}</h2>
                        <p className="text-slate-300 text-sm mb-8">
                            {clienteNombre} · {new Date(venta.fecha_venta).toLocaleDateString()}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="bg-white/5 rounded-xl p-4 min-w-[140px] border border-white/10">
                                <p className="text-xs text-slate-400 mb-1 font-medium">Monto recibo</p>
                                <p className="text-xl font-bold">Q{Number(venta.monto_recibo).toFixed(2)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 min-w-[140px] border border-white/10">
                                <p className="text-xs text-slate-400 mb-1 font-medium">Monto neto</p>
                                <p className="text-xl font-bold">Q{Number(venta.monto_neto).toFixed(2)}</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 min-w-[140px] border border-white/10">
                                <p className="text-xs text-slate-400 mb-1 font-medium">Comisión</p>
                                <p className="text-xl font-bold">
                                    {venta.comision_operador !== null ? `Q${Number(venta.comision_operador).toFixed(2)}` : "—"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-white text-[#0f172a] uppercase tracking-wider">
                                {venta.metodo_pago}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Detalles de viaje</h3>
                                <p className="text-sm text-slate-500">2 servicios incluidos</p>
                            </div>
                            <button className="bg-[#facc15] hover:bg-[#eab308] text-slate-900 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
                                <Plus className="w-4 h-4 stroke-[3]" />
                                Agregar servicio
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex relative group hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-1.5 bg-[#0ea5e9] absolute left-0 top-0 bottom-0" />
                                <div className="p-6 pl-8 w-full flex items-start gap-5">
                                    <div className="w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                                        <Plane className="w-5 h-5 text-sky-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-slate-800 text-base">Tiquete aéreo</h4>
                                                <span className="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                    Internacional
                                                </span>
                                            </div>
                                            <p className="font-bold text-slate-800 text-base">Q1,800.00</p>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 font-medium">Guatemala → Estados Unidos</p>
                                        <div className="flex items-center gap-5 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-slate-400" /> 2 pax
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Plane className="w-3.5 h-3.5 text-slate-400" /> Avianca
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                Global Travel Co.
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4 italic">
                                            Asientos preferenciales, maleta 23kg incluida
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex relative group hover:shadow-md transition-shadow cursor-pointer">
                                <div className="w-1.5 bg-[#eab308] absolute left-0 top-0 bottom-0" />
                                <div className="p-6 pl-8 w-full flex items-start gap-5">
                                    <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                        <Hotel className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-bold text-slate-800 text-base">Hotel</h4>
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                                    Internacional
                                                </span>
                                            </div>
                                            <p className="font-bold text-slate-800 text-base">Q650.00</p>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-4 font-medium">— → Estados Unidos</p>
                                        <div className="flex items-center gap-5 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-slate-400" /> 2 pax
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                Mayorista Tours S.A.
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4 italic">
                                            3 noches hotel Miami Beach
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
