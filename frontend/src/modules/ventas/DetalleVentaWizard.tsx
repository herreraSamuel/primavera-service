import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Servicio, Pais, Proveedor, Aerolinea, CreateDetalleVentaDTO } from "@agency/shared";
import { getMetadataFields, type MetadataFieldConfig } from "./service-metadata.config";

interface GlobalFormValues {
    origen_pais_id: string;
    ciudad_origen: string;
    destino_pais_id: string;
    ciudad_destino: string;
    cantidad_pasajeros: number;
}

interface ServiceFormValues {
    origen_pais_id: string;
    ciudad_origen: string;
    destino_pais_id: string;
    ciudad_destino: string;
    cantidad_pasajeros: number;
    precio_unitario: number;
    proveedor_id: string;
    [key: `meta_${string}`]: string | number;
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
    const [globalData, setGlobalData] = useState<GlobalFormValues | null>(null);
    const [collectedData, setCollectedData] = useState<CreateDetalleVentaDTO[]>([]);
    const [showOverride, setShowOverride] = useState(false);

    const hasGlobalStep = selectedServices.length > 1;
    const totalSteps = hasGlobalStep ? selectedServices.length + 1 : selectedServices.length;
    const isGlobalStep = hasGlobalStep && currentStep === 0;
    const serviceIndex = hasGlobalStep ? currentStep - 1 : currentStep;
    const currentService = isGlobalStep ? null : selectedServices[serviceIndex];
    const isLastStep = currentStep === totalSteps - 1;
    const progress = ((currentStep + 1) / totalSteps) * 100;

    const globalForm = useForm<GlobalFormValues>();
    const serviceForm = useForm<ServiceFormValues>();

    // Init defaults when modal opens
    useEffect(() => {
        if (isOpen) {
            const guateId = paises.find((p) => p.nombre.toLowerCase() === "guatemala")?.id?.toString() || "";
            const defaults = {
                origen_pais_id: guateId,
                ciudad_origen: "Ciudad de Guatemala",
                destino_pais_id: "",
                ciudad_destino: "",
                cantidad_pasajeros: 1,
            };
            globalForm.reset(defaults);

            if (!hasGlobalStep && selectedServices.length > 0) {
                const metaFields = getMetadataFields(selectedServices[0].id);
                const metaDefaults: Record<string, string | number> = {};
                metaFields.forEach((f) => {
                    metaDefaults[`meta_${f.key}`] = f.type === "number" ? 0 : "";
                });
                metaDefaults["meta_notas_adicionales"] = "";
                
                serviceForm.reset({
                    ...defaults,
                    precio_unitario: 0,
                    proveedor_id: "",
                    ...metaDefaults,
                } as ServiceFormValues);
            }
        }
    }, [isOpen, paises, hasGlobalStep, selectedServices, globalForm, serviceForm]);

    const resetServiceForm = (global: GlobalFormValues, service: Servicio) => {
        const metaFields = getMetadataFields(service.id);
        const metaDefaults: Record<string, string | number> = {};
        metaFields.forEach((f) => {
            metaDefaults[`meta_${f.key}`] = f.type === "number" ? 0 : "";
        });
        metaDefaults["meta_notas_adicionales"] = "";

        serviceForm.reset({
            origen_pais_id: global.origen_pais_id,
            ciudad_origen: global.ciudad_origen,
            destino_pais_id: global.destino_pais_id,
            ciudad_destino: global.ciudad_destino,
            cantidad_pasajeros: global.cantidad_pasajeros,
            precio_unitario: 0,
            proveedor_id: "",
            ...metaDefaults,
        } as ServiceFormValues);
        setShowOverride(false);
    };

    const handleGlobalSubmit = (data: GlobalFormValues) => {
        setGlobalData(data);
        setCurrentStep(1);
        resetServiceForm(data, selectedServices[0]);
    };

    const GRUPO_ADMINISTRATIVO = [4, 12, 14];
    const GRUPO_ESTACIONARIO = [13, 15, 16, 17];
    const GRUPO_TRANSPORTE = [11];

    const handleServiceSubmit = (formData: ServiceFormValues) => {
        const metaFields = getMetadataFields(currentService!.id);
        const metadata: Record<string, unknown> = {};

        metaFields.forEach((f) => {
            const val = formData[`meta_${f.key}` as keyof ServiceFormValues];
            if (val !== "" && val !== undefined && val !== null) {
                metadata[f.key] = f.type === "number" ? Number(val) : val;
            }
        });

        const notas = formData["meta_notas_adicionales" as keyof ServiceFormValues];
        if (notas && String(notas).trim()) {
            metadata["notas_adicionales"] = String(notas).trim();
        }

        let origen_pais_id = formData.origen_pais_id ? Number(formData.origen_pais_id) : null;
        let ciudad_origen = formData.ciudad_origen || null;
        let destino_pais_id = formData.destino_pais_id ? Number(formData.destino_pais_id) : null;
        let ciudad_destino = formData.ciudad_destino || null;

        if (GRUPO_ADMINISTRATIVO.includes(currentService!.id)) {
            origen_pais_id = null;
            ciudad_origen = null;
            destino_pais_id = null;
            ciudad_destino = null;
        } else if (GRUPO_ESTACIONARIO.includes(currentService!.id)) {
            origen_pais_id = null;
            ciudad_origen = null;
        }

        const detalle: CreateDetalleVentaDTO = {
            venta_id: Number(ventaId),
            servicio_id: currentService!.id,
            origen_pais_id,
            ciudad_origen,
            destino_pais_id,
            ciudad_destino,
            cantidad_pasajeros: Number(formData.cantidad_pasajeros) || 1,
            precio_unitario: Number(formData.precio_unitario) || 0,
            proveedor_id: formData.proveedor_id ? Number(formData.proveedor_id) : null,
            metadata_servicio: Object.keys(metadata).length > 0 ? metadata : null,
        };

        if (isLastStep) {
            onComplete([...collectedData, detalle]);
        } else {
            setCollectedData((prev) => [...prev, detalle]);
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            resetServiceForm(globalData!, selectedServices[serviceIndex + 1]);
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        setGlobalData(null);
        setCollectedData([]);
        setShowOverride(false);
        globalForm.reset();
        serviceForm.reset();
        onClose();
    };

    const getPaisNombre = (id: string) => {
        if (!id) return "—";
        const pais = paises.find((p) => String(p.id) === id);
        return pais?.nombre || "—";
    };

    const labelClasses = "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block";
    const selectClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";
    const inputClasses = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

    const renderMetadataField = (field: MetadataFieldConfig) => {
        const fieldName = `meta_${field.key}` as keyof ServiceFormValues;

        if (field.type === "select" && field.options) {
            return (
                <div key={field.key}>
                    <label className={labelClasses}>{field.label}</label>
                    <select {...serviceForm.register(fieldName)} className={selectClasses}>
                        <option value="">— {field.label} —</option>
                        {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            );
        }

        return (
            <div key={field.key}>
                <label className={labelClasses}>{field.label}</label>
                <input
                    type={field.type === "number" ? "number" : "text"}
                    min={field.type === "number" ? 0 : undefined}
                    step={field.type === "number" ? "1" : undefined}
                    placeholder={field.placeholder}
                    {...serviceForm.register(fieldName)}
                    className={inputClasses}
                />
            </div>
        );
    };

    const renderLocationInputs = (
        formObj: any,
        mode: "ALL" | "DESTINO_ONLY",
        labels: { origenPais?: string; origenCiudad?: string; destinoPais?: string; destinoCiudad?: string } = {}
    ) => (
        <>
            {mode === "ALL" && (
                <>
                    <div>
                        <label className={labelClasses}>{labels.origenPais || "País origen"}</label>
                        <select {...formObj.register("origen_pais_id")} className={selectClasses}>
                            <option value="">— {labels.origenPais || "País origen"} —</option>
                            {paises.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>{labels.origenCiudad || "Ciudad origen"}</label>
                        <input
                            type="text"
                            placeholder="Ej: Ciudad de Guatemala"
                            {...formObj.register("ciudad_origen")}
                            className={inputClasses}
                        />
                    </div>
                </>
            )}
            <div>
                <label className={labelClasses}>{labels.destinoPais || "País destino"}</label>
                <select {...formObj.register("destino_pais_id")} className={selectClasses}>
                    <option value="">— {labels.destinoPais || "País destino"} —</option>
                    {paises.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className={labelClasses}>{labels.destinoCiudad || "Ciudad destino"}</label>
                <input
                    type="text"
                    placeholder="Ej: Miami..."
                    {...formObj.register("ciudad_destino")}
                    className={inputClasses}
                />
            </div>
            <div className={mode === "ALL" ? "col-span-2 md:col-span-1" : "col-span-2"}>
                <label className={labelClasses}>Cantidad de pasajeros</label>
                <input
                    type="number"
                    min={1}
                    {...formObj.register("cantidad_pasajeros")}
                    className={inputClasses}
                />
            </div>
        </>
    );

    const renderGlobalStep = () => (
        <form onSubmit={globalForm.handleSubmit(handleGlobalSubmit)} className="px-8 pb-8">
            <div className="grid grid-cols-2 gap-3 mb-8">
                {renderLocationInputs(globalForm, "ALL", {
                    origenPais: "País origen global",
                    origenCiudad: "Ciudad origen global",
                    destinoPais: "País destino global",
                    destinoCiudad: "Ciudad destino global"
                })}
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
                    className="flex-1 h-12 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </form>
    );

    const renderInheritedSummary = (serviceId: number) => {
        if (!globalData) return null;

        const origen = getPaisNombre(globalData.origen_pais_id);
        const destino = getPaisNombre(globalData.destino_pais_id);
        const ciudadOrigen = globalData.ciudad_origen || "";
        const ciudadDestino = globalData.ciudad_destino || "";
        const origenText = ciudadOrigen ? `${ciudadOrigen}, ${origen}` : origen;
        const destinoText = ciudadDestino ? `${ciudadDestino}, ${destino}` : destino;

        const isEstacionario = GRUPO_ESTACIONARIO.includes(serviceId);

        return (
            <div className="mb-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 truncate flex-1">
                        {isEstacionario ? (
                            <>📍 Ubicación: <span className="font-semibold">{destinoText}</span> <span className="text-slate-400 mx-1">·</span> {serviceForm.watch("cantidad_pasajeros")} pax</>
                        ) : (
                            <>📍 Origen: <span className="font-semibold">{origenText}</span> <span className="text-slate-400 mx-1">→</span> Destino: <span className="font-semibold">{destinoText}</span> <span className="text-slate-400 mx-1">·</span> {serviceForm.watch("cantidad_pasajeros")} pax</>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowOverride(!showOverride)}
                        className="flex-shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#0367A6] hover:text-[#025185] transition-colors"
                    >
                        {showOverride ? "Ocultar" : "Editar detalles específicos"}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOverride ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {showOverride && (
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed border-slate-200">
                        {renderLocationInputs(serviceForm, isEstacionario ? "DESTINO_ONLY" : "ALL", isEstacionario ? { destinoPais: "País de servicio", destinoCiudad: "Ciudad de servicio" } : {})}
                    </div>
                )}
            </div>
        );
    };

    const renderServiceStep = () => {
        if (!currentService) return null;
        const metaFields = getMetadataFields(currentService.id);
        
        const isAdministrativo = GRUPO_ADMINISTRATIVO.includes(currentService.id);
        const isEstacionario = GRUPO_ESTACIONARIO.includes(currentService.id);

        return (
            <form onSubmit={serviceForm.handleSubmit(handleServiceSubmit)} className="px-8 pb-8">
                {!isAdministrativo && (
                    hasGlobalStep ? (
                        renderInheritedSummary(currentService.id)
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {renderLocationInputs(serviceForm, isEstacionario ? "DESTINO_ONLY" : "ALL", isEstacionario ? { destinoPais: "País de servicio", destinoCiudad: "Ciudad de servicio" } : {})}
                        </div>
                    )
                )}

                <div className={`grid ${currentService.id === 11 || (currentService.id !== 4 && currentService.id !== 12) ? "grid-cols-2" : "grid-cols-1"} gap-3 mb-4`}>
                    <div>
                        <label className={labelClasses}>Precio unitario</label>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            {...serviceForm.register("precio_unitario")}
                            className={inputClasses}
                        />
                    </div>
                    {currentService.id !== 11 && currentService.id !== 4 && currentService.id !== 12 ? (
                        <div>
                            <label className={labelClasses}>Proveedor</label>
                            <select {...serviceForm.register("proveedor_id")} className={selectClasses}>
                                <option value="">— Proveedor —</option>
                                {proveedores.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </div>
                    ) : currentService.id === 11 ? (
                        <div>
                            <label className={labelClasses}>Aerolínea</label>
                            <select {...serviceForm.register("meta_aerolinea" as keyof ServiceFormValues)} className={selectClasses}>
                                <option value="">— Aerolínea —</option>
                                {aerolineas.map((a) => (
                                    <option key={a.id} value={a.nombre}>{a.nombre}</option>
                                ))}
                            </select>
                        </div>
                    ) : null}
                </div>

                {metaFields.filter(f => f.key !== "aerolinea").length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {metaFields.filter(f => f.key !== "aerolinea").map(renderMetadataField)}
                    </div>
                )}

                <div className="mb-6">
                    <label className={labelClasses}>Notas adicionales</label>
                    <textarea
                        {...serviceForm.register("meta_notas_adicionales" as keyof ServiceFormValues)}
                        rows={2}
                        className={`${inputClasses} resize-none`}
                        placeholder="Observaciones o detalles extra..."
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 h-11 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 h-11 rounded-xl bg-[#facc15] hover:bg-[#eab308] text-slate-900 font-semibold transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : isLastStep ? "Finalizar" : "Siguiente"}
                    </button>
                </div>
            </form>
        );
    };

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
                            <span className="text-sm font-bold text-slate-600">{currentStep + 1} / {totalSteps}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                            <div
                                className="h-full bg-[#eab308] rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {!isLastStep && (
                            <p className="text-xs text-slate-400 mb-4">
                                {isGlobalStep
                                    ? "Define los datos generales del paquete"
                                    : `Después de guardar, continúa con el servicio ${serviceIndex + 2}`}
                            </p>
                        )}

                        <div className="flex items-center justify-between mb-6 mt-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {isGlobalStep ? "Datos globales del paquete" : currentService?.nombre}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {isGlobalStep
                                        ? "Estos datos se heredarán a cada servicio"
                                        : "Completa los datos de este servicio"}
                                </p>
                            </div>
                            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {isGlobalStep ? renderGlobalStep() : renderServiceStep()}
                </DialogPrimitive.Popup>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
