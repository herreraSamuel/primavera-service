import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Plane, Ship, Hotel, Shield, MapPin, FileText, Check, Package } from "lucide-react";
import { useState } from "react";
import type { Servicio } from "@agency/shared";

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
    "boleto aereo": Plane,
    "crucero": Ship,
    "hotel": Hotel,
    "seguro": Shield,
    "tour guiado": MapPin,
    "tramite de visa americana": FileText,
};

const getServiceIcon = (nombre: string) => {
    const key = nombre.toLowerCase();
    return SERVICE_ICON_MAP[key] || Package;
};

interface ServicePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    servicios: Servicio[];
    isLoading: boolean;
    onConfirm: (selected: Servicio[]) => void;
}

export function ServicePickerModal({
    isOpen,
    onClose,
    servicios,
    isLoading,
    onConfirm,
}: ServicePickerModalProps) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggleService = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        const selected = servicios.filter((s) => selectedIds.has(s.id));
        onConfirm(selected);
        setSelectedIds(new Set());
    };

    const handleClose = () => {
        setSelectedIds(new Set());
        onClose();
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Backdrop 
                    style={{ zIndex: 100 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" 
                />
                <DialogPrimitive.Popup 
                    style={{ zIndex: 100 }}
                    className="fixed top-1/2 left-1/2 w-full max-w-[580px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
                >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Armar paquete</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        Elige los servicios que incluye este paquete. Completarás los datos de cada uno por separado.
                    </p>

                    {isLoading ? (
                        <div className="py-12 text-center text-slate-500 animate-pulse">Cargando servicios...</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {servicios.map((servicio) => {
                                const Icon = getServiceIcon(servicio.nombre);
                                const isSelected = selectedIds.has(servicio.id);
                                return (
                                    <button
                                        key={servicio.id}
                                        onClick={() => toggleService(servicio.id)}
                                        className={`relative flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                                            isSelected
                                                ? "border-[#0367A6] bg-blue-50/50"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                                            isSelected ? "bg-[#0367A6]/10" : "bg-slate-100"
                                        }`}>
                                            <Icon className={`w-5 h-5 ${isSelected ? "text-[#0367A6]" : "text-slate-400"}`} />
                                        </div>
                                        <span className={`text-sm font-semibold ${isSelected ? "text-[#0367A6]" : "text-slate-700"}`}>
                                            {servicio.nombre}
                                        </span>
                                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                            isSelected
                                                ? "border-[#0367A6] bg-[#0367A6]"
                                                : "border-slate-300 bg-white"
                                        }`}>
                                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleClose}
                            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedIds.size === 0}
                            className="flex-1 h-12 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {selectedIds.size === 0
                                ? "Seleccionar..."
                                : `Seleccionar ${selectedIds.size} servicio${selectedIds.size > 1 ? "s" : ""}`}
                        </button>
                    </div>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
