import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Servicio, Pais, Aerolinea, Proveedor, CreateDetalleVentaDTO } from "@agency/shared";

interface DetalleFormValues {
    tipo_viaje: string;
    origen_pais_id: string;
    destino_pais_id: string;
    cantidad_pasajeros: number;
    precio_boletos: number;
    aerolinea_id: string;
    proveedor_id: string;
    detalles_especificos: string;
}

interface DetalleVentaWizardProps {
    isOpen: boolean;
    onClose: () => void;
    selectedServices: Servicio[];
    ventaId: number | string;
    paises: Pais[];
    aerolineas: Aerolinea[];
    proveedores: Proveedor[];
    onComplete: (detalles: CreateDetalleVentaDTO[]) => void;
    isPending: boolean;
}

export function DetalleVentaWizard({
    isOpen,
    onClose,
    selectedServices,
    ventaId,
    paises,
    aerolineas,
    proveedores,
    onComplete,
    isPending,
}: DetalleVentaWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [collectedData, setCollectedData] = useState<CreateDetalleVentaDTO[]>([]);
    const total = selectedServices.length;
    const currentService = selectedServices[currentStep];
    const isLastStep = currentStep === total - 1;

    const { register, handleSubmit, reset } = useForm<DetalleFormValues>({
        defaultValues: {
            tipo_viaje: "",
            origen_pais_id: "",
            destino_pais_id: "",
            cantidad_pasajeros: 1,
            precio_boletos: 0,
            aerolinea_id: "",
            proveedor_id: "",
            detalles_especificos: "",
        },
    });

    const onSubmit = (formData: DetalleFormValues) => {
        const detalle: CreateDetalleVentaDTO = {
            venta_id: Number(ventaId),
            servicio_id: currentService.id,
            tipo_viaje: formData.tipo_viaje ? (formData.tipo_viaje as 'SOLO_IDA' | 'IDA_Y_VUELTA') : null,
            origen_pais_id: formData.origen_pais_id ? Number(formData.origen_pais_id) : null,
            destino_pais_id: formData.destino_pais_id ? Number(formData.destino_pais_id) : null,
            cantidad_pasajeros: Number(formData.cantidad_pasajeros) || 1,
            precio_boletos: Number(formData.precio_boletos) || 0,
            aerolinea_id: formData.aerolinea_id ? Number(formData.aerolinea_id) : null,
            proveedor_id: formData.proveedor_id ? Number(formData.proveedor_id) : null,
            detalles_especificos: formData.detalles_especificos || null,
        };

        if (isLastStep) {
            onComplete([...collectedData, detalle]);
        } else {
            setCollectedData((prev) => [...prev, detalle]);
            setCurrentStep((prev) => prev + 1);
            reset();
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        setCollectedData([]);
        reset();
        onClose();
    };

    if (!currentService) return null;

    const progress = ((currentStep + 1) / total) * 100;

    const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block";
    const selectClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
    const inputClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Backdrop 
                    style={{ zIndex: 110 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" 
                />
                <DialogPrimitive.Popup 
                    style={{ zIndex: 110 }}
                    className="fixed top-1/2 left-1/2 w-full max-w-[650px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
                >
                    <div className="p-8 pb-0">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-[#eab308]">Configurando paquete</p>
                            <span className="text-sm font-bold text-slate-600">{currentStep + 1} / {total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                            <div
                                className="h-full bg-[#eab308] rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {!isLastStep && (
                            <p className="text-xs text-slate-400 mb-4">
                                Después de guardar, continúa con el servicio {currentStep + 2}
                            </p>
                        )}

                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{currentService.nombre}</h3>
                                <p className="text-sm text-slate-500">Completa los datos de este servicio</p>
                            </div>
                            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                            <div>
                                <label className={labelClasses}>Servicio</label>
                                <select disabled className={`${selectClasses} bg-slate-50 text-slate-500`}>
                                    <option>{currentService.nombre}</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Tipo de viaje</label>
                                <select {...register("tipo_viaje")} className={selectClasses}>
                                    <option value="">— Tipo de viaje —</option>
                                    <option value="SOLO_IDA">Solo ida</option>
                                    <option value="IDA_Y_VUELTA">Ida y vuelta</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>País origen</label>
                                <select {...register("origen_pais_id")} className={selectClasses}>
                                    <option value="">— País origen —</option>
                                    {paises.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>País destino</label>
                                <select {...register("destino_pais_id")} className={selectClasses}>
                                    <option value="">— País destino —</option>
                                    {paises.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Pasajeros</label>
                                <input type="number" min={1} {...register("cantidad_pasajeros")} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Precio boletos</label>
                                <input type="number" min={0} step="0.01" {...register("precio_boletos")} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Aerolínea</label>
                                <select {...register("aerolinea_id")} className={selectClasses}>
                                    <option value="">— Aerolínea —</option>
                                    {aerolineas.map((a) => (
                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Proveedor</label>
                                <select {...register("proveedor_id")} className={selectClasses}>
                                    <option value="">— Proveedor —</option>
                                    {proveedores.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className={labelClasses}>Detalles específicos</label>
                            <textarea
                                {...register("detalles_especificos")}
                                rows={2}
                                className={`${inputClasses} resize-none`}
                                placeholder="Ej: Asientos preferenciales, maleta 23kg incluida..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 h-12 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors disabled:opacity-50"
                            >
                                {isPending ? "Guardando..." : isLastStep ? "Finalizar" : "Agregar detalle"}
                            </button>
                        </div>
                    </form>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
