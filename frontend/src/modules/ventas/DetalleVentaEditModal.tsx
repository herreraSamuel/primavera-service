import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Pais, Aerolinea, Proveedor, DetalleVenta, CreateDetalleVentaDTO } from "@agency/shared";
import { getMetadataFields } from "./service-metadata.config";

const GRUPO_ADMINISTRATIVO = [4, 12, 14];
const GRUPO_ESTACIONARIO = [13, 15, 16, 17];

interface DetalleFormValues {
    origen_pais_id: string;
    ciudad_origen: string;
    destino_pais_id: string;
    ciudad_destino: string;
    cantidad_pasajeros: number;
    precio_unitario: number;
    proveedor_id: string;
    detalles_especificos: string;
    [key: string]: any;
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
            origen_pais_id: "",
            ciudad_origen: "",
            destino_pais_id: "",
            ciudad_destino: "",
            cantidad_pasajeros: 1,
            precio_unitario: 0,
            proveedor_id: "",
            detalles_especificos: "",
        },
    });

    useEffect(() => {
        if (isOpen && detalle) {
            const metadata = (detalle.metadata_servicio as Record<string, any>) || {};
            const metaFields: Record<string, any> = {};
            if (detalle.servicio_id) {
                const fields = getMetadataFields(detalle.servicio_id);
                fields.forEach(f => {
                    metaFields[`meta_${f.key}`] = metadata[f.key] || "";
                });
            }

            reset({
                origen_pais_id: detalle.origen_pais_id ? String(detalle.origen_pais_id) : "",
                ciudad_origen: detalle.ciudad_origen || "",
                destino_pais_id: detalle.destino_pais_id ? String(detalle.destino_pais_id) : "",
                ciudad_destino: detalle.ciudad_destino || "",
                cantidad_pasajeros: detalle.cantidad_pasajeros,
                precio_unitario: Number(detalle.precio_unitario),
                proveedor_id: detalle.proveedor_id ? String(detalle.proveedor_id) : "",
                detalles_especificos: detalle.detalles_especificos || "",
                ...metaFields
            });
        }
    }, [isOpen, detalle, reset]);

    const onSubmit = (formData: DetalleFormValues) => {
        if (!detalle?.servicio_id) return;
        const serviceId = detalle.servicio_id;
        
        const isAdministrativo = GRUPO_ADMINISTRATIVO.includes(serviceId);
        const isEstacionario = GRUPO_ESTACIONARIO.includes(serviceId);

        const metadata: Record<string, unknown> = {};
        const metaFields = getMetadataFields(serviceId);
        metaFields.forEach((f) => {
            const val = formData[`meta_${f.key}`];
            if (val !== "" && val !== undefined && val !== null) {
                metadata[f.key] = f.type === "number" ? Number(val) : val;
            }
        });

        onConfirm({
            tipo_viaje: null,
            origen_pais_id: !isAdministrativo && !isEstacionario && formData.origen_pais_id ? Number(formData.origen_pais_id) : null,
            ciudad_origen: !isAdministrativo && !isEstacionario && formData.ciudad_origen ? formData.ciudad_origen : null,
            destino_pais_id: !isAdministrativo && formData.destino_pais_id ? Number(formData.destino_pais_id) : null,
            ciudad_destino: !isAdministrativo && formData.ciudad_destino ? formData.ciudad_destino : null,
            cantidad_pasajeros: Number(formData.cantidad_pasajeros) || 1,
            precio_unitario: Number(formData.precio_unitario) || 0,
            proveedor_id: formData.proveedor_id && serviceId !== 11 && !isAdministrativo ? Number(formData.proveedor_id) : null,
            detalles_especificos: formData.detalles_especificos || null,
            metadata_servicio: Object.keys(metadata).length > 0 ? metadata : undefined,
        });
    };

    if (!detalle || !detalle.servicio_id) return null;

    const serviceId = detalle.servicio_id;
    const isAdministrativo = GRUPO_ADMINISTRATIVO.includes(serviceId);
    const isEstacionario = GRUPO_ESTACIONARIO.includes(serviceId);
    const metaFields = getMetadataFields(serviceId);

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
                    className="fixed top-1/2 left-1/2 z-[60] w-full max-w-[650px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-8 pb-6 shrink-0 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Editar {serviceName}</h3>
                                <p className="text-sm text-slate-500">Modifica los detalles del servicio</p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto p-8">
                        <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                            {!isAdministrativo && (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                                    {!isEstacionario && (
                                        <>
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
                                                <label className={labelClasses}>Ciudad origen</label>
                                                <input type="text" {...register("ciudad_origen")} className={inputClasses} placeholder="Ej: Ciudad de Guatemala" />
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className={labelClasses}>{isEstacionario ? "País de servicio" : "País destino"}</label>
                                        <select {...register("destino_pais_id")} className={selectClasses}>
                                            <option value="">— {isEstacionario ? "País de servicio" : "País destino"} —</option>
                                            {paises.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClasses}>{isEstacionario ? "Ciudad de servicio" : "Ciudad destino"}</label>
                                        <input type="text" {...register("ciudad_destino")} className={inputClasses} placeholder="Ej: Miami" />
                                    </div>
                                </div>
                            )}

                            <div className={`grid ${serviceId === 11 || (!isAdministrativo && serviceId !== 11) ? "grid-cols-2" : "grid-cols-1"} gap-x-6 gap-y-5 mb-6`}>
                                <div>
                                    <label className={labelClasses}>Precio unitario</label>
                                    <input type="number" min={0} step="0.01" {...register("precio_unitario")} className={inputClasses} />
                                </div>
                                {serviceId !== 11 && !isAdministrativo && (
                                    <div>
                                        <label className={labelClasses}>Proveedor</label>
                                        <select {...register("proveedor_id")} className={selectClasses}>
                                            <option value="">— Proveedor —</option>
                                            {proveedores.map((p) => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {serviceId === 11 && (
                                    <div>
                                        <label className={labelClasses}>Aerolínea</label>
                                        <select {...register("meta_aerolinea")} className={selectClasses}>
                                            <option value="">— Aerolínea —</option>
                                            {aerolineas.map((a) => (
                                                <option key={a.id} value={a.nombre}>{a.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {metaFields.filter(f => f.key !== "aerolinea").length > 0 && (
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                    {metaFields.filter(f => f.key !== "aerolinea").map((f) => (
                                        <div key={f.key}>
                                            <label className={labelClasses}>{f.label}</label>
                                            {f.type === "select" ? (
                                                <select {...register(`meta_${f.key}`)} className={selectClasses}>
                                                    <option value="">— {f.label} —</option>
                                                    {f.options?.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={f.type === "number" ? "number" : "text"}
                                                    placeholder={f.placeholder}
                                                    {...register(`meta_${f.key}`)}
                                                    className={inputClasses}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 mb-6">
                                <div>
                                    <label className={labelClasses}>Pasajeros</label>
                                    <input type="number" min={1} {...register("cantidad_pasajeros")} className={inputClasses} />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className={labelClasses}>Detalles específicos / Comentarios</label>
                                <textarea
                                    {...register("detalles_especificos")}
                                    rows={2}
                                    className={`${inputClasses} resize-none`}
                                    placeholder="Ej: Asientos preferenciales, maleta 23kg incluida..."
                                />
                            </div>
                        </form>
                    </div>

                    <div className="p-8 pt-4 shrink-0 bg-white border-t border-slate-100 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="edit-form"
                            disabled={isPending}
                            className="flex-1 h-12 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors disabled:opacity-50"
                        >
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
