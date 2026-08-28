import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Pais, Aerolinea, Proveedor, DetalleVenta, CreateDetalleVentaDTO } from "@agency/shared";

interface DetalleFormValues {
    tipo_viaje: string;
    origen_pais_id: string;
    destino_pais_id: string;
    cantidad_pasajeros: number;
    precio_unitario: number;
    aerolinea_id: string;
    proveedor_id: string;
    detalles_especificos: string;
}

interface DetalleVentaEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    detalle: DetalleVenta | null;
    paises: Pais[];
    aerolineas: Aerolinea[];
    proveedores: Proveedor[];
    onConfirm: (data: Partial<CreateDetalleVentaDTO>) => void;
    isPending: boolean;
}

export function DetalleVentaEditModal({
    isOpen,
    onClose,
    detalle,
    paises,
    aerolineas,
    proveedores,
    onConfirm,
    isPending,
}: DetalleVentaEditModalProps) {
    const { register, handleSubmit, reset } = useForm<DetalleFormValues>({
        defaultValues: {
            tipo_viaje: "",
            origen_pais_id: "",
            destino_pais_id: "",
            cantidad_pasajeros: 1,
            precio_unitario: 0,
            aerolinea_id: "",
            proveedor_id: "",
            detalles_especificos: "",
        },
    });

    useEffect(() => {
        if (isOpen && detalle) {
            reset({
                tipo_viaje: detalle.tipo_viaje || "",
                origen_pais_id: detalle.origen_pais_id ? String(detalle.origen_pais_id) : "",
                destino_pais_id: detalle.destino_pais_id ? String(detalle.destino_pais_id) : "",
                cantidad_pasajeros: detalle.cantidad_pasajeros,
                precio_unitario: Number(detalle.precio_unitario),
                aerolinea_id: detalle.aerolinea_id ? String(detalle.aerolinea_id) : "",
                proveedor_id: detalle.proveedor_id ? String(detalle.proveedor_id) : "",
                detalles_especificos: detalle.detalles_especificos || "",
            });
        }
    }, [isOpen, detalle, reset]);

    const onSubmit = (formData: DetalleFormValues) => {
        onConfirm({
            tipo_viaje: formData.tipo_viaje ? (formData.tipo_viaje as 'SOLO_IDA' | 'IDA_Y_VUELTA') : null,
            origen_pais_id: formData.origen_pais_id ? Number(formData.origen_pais_id) : null,
            destino_pais_id: formData.destino_pais_id ? Number(formData.destino_pais_id) : null,
            cantidad_pasajeros: Number(formData.cantidad_pasajeros) || 1,
            precio_unitario: Number(formData.precio_unitario) || 0,
            aerolinea_id: formData.aerolinea_id ? Number(formData.aerolinea_id) : null,
            proveedor_id: formData.proveedor_id ? Number(formData.proveedor_id) : null,
            detalles_especificos: formData.detalles_especificos || null,
        });
    };

    if (!detalle) return null;

    const serviceName = detalle.servicios?.nombre || "Servicio";
    const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block";
    const selectClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
    const inputClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Backdrop 
                    style={{ zIndex: 110 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" 
                />
                <DialogPrimitive.Popup 
                    style={{ zIndex: 110 }}
                    className="fixed top-1/2 left-1/2 z-[60] w-full max-w-[650px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
                >
                    <div className="p-8 pb-0">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Editar {serviceName}</h3>
                                <p className="text-sm text-slate-500">Modifica los datos del servicio</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                            <div>
                                <label className={labelClasses}>Servicio</label>
                                <select disabled className={`${selectClasses} bg-slate-50 text-slate-500`}>
                                    <option>{serviceName}</option>
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
                                <label className={labelClasses}>Precio unitario</label>
                                <input type="number" min={0} step="0.01" {...register("precio_unitario")} className={inputClasses} />
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
                                onClick={onClose}
                                className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 h-12 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors disabled:opacity-50"
                            >
                                {isPending ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </form>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
