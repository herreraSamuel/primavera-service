import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X, Plane, Ship, Hotel, Shield, MapPin, FileText, Plus, Users, Trash2, Package, Edit } from "lucide-react";
import { useState } from "react";
import type { Venta, DetalleVenta, Servicio, CreateDetalleVentaDTO } from "@agency/shared";
import { useDetallesVenta } from "./useDetallesVenta";
import { ServicePickerModal } from "./ServicePickerModal";
import { DetalleVentaWizard } from "./DetalleVentaWizard";
import { DetalleVentaEditModal } from "./DetalleVentaEditModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
    "boleto aereo": Plane,
    "crucero": Ship,
    "hotel": Hotel,
    "seguro": Shield,
    "tour guiado": MapPin,
    "tramite de visa americana": FileText,
};

const SERVICE_COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
    "boleto aereo": { border: "bg-[#0ea5e9]", bg: "bg-sky-50", text: "text-sky-500" },
    "crucero": { border: "bg-[#06b6d4]", bg: "bg-cyan-50", text: "text-cyan-500" },
    "hotel": { border: "bg-[#eab308]", bg: "bg-amber-50", text: "text-amber-500" },
    "seguro": { border: "bg-[#10b981]", bg: "bg-emerald-50", text: "text-emerald-500" },
    "tour guiado": { border: "bg-[#8b5cf6]", bg: "bg-violet-50", text: "text-violet-500" },
    "tramite de visa americana": { border: "bg-[#f97316]", bg: "bg-orange-50", text: "text-orange-500" },
};

const getServiceIcon = (nombre: string) => {
    return SERVICE_ICON_MAP[nombre.toLowerCase()] || Package;
};

const getServiceColors = (nombre: string) => {
    return SERVICE_COLOR_MAP[nombre.toLowerCase()] || { border: "bg-slate-400", bg: "bg-slate-50", text: "text-slate-500" };
};

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
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState<Servicio[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [editingDetalle, setEditingDetalle] = useState<DetalleVenta | null>(null);
    const [deletingDetalleId, setDeletingDetalleId] = useState<string | number | null>(null);

    const {
        detallesQuery,
        serviciosQuery,
        paisesQuery,
        aerolineasQuery,
        proveedoresQuery,
        createDetallesBulk,
        updateDetalle,
        deleteDetalle,
    } = useDetallesVenta(venta?.id);

    if (!venta) return null;

    const clienteNombre = venta.clientes
        ? `${venta.clientes.primer_nombre} ${venta.clientes.primer_apellido}`
        : "—";

    const detalles: DetalleVenta[] = detallesQuery.data || [];

    const handleServicesPicked = (services: Servicio[]) => {
        setSelectedServices(services);
        setIsPickerOpen(false);
        setIsWizardOpen(true);
    };

    const handleWizardComplete = (items: CreateDetalleVentaDTO[]) => {
        createDetallesBulk.mutate(items, {
            onSuccess: () => {
                setIsWizardOpen(false);
                setSelectedServices([]);
            },
        });
    };

    const handleDeleteConfirm = () => {
        if (!deletingDetalleId) return;
        deleteDetalle.mutate(deletingDetalleId, {
            onSuccess: () => setDeletingDetalleId(null),
        });
    };

    const renderDetalleCard = (detalle: DetalleVenta) => {
        const serviceName = detalle.servicios?.nombre || "Servicio";
        const Icon = getServiceIcon(serviceName);
        const colors = getServiceColors(serviceName);
        const origenNombre = detalle.pais_origen?.nombre;
        const destinoNombre = detalle.pais_destino?.nombre;
        let locationText = null;
        if (origenNombre && destinoNombre) {
            locationText = `${origenNombre} → ${destinoNombre}`;
        } else if (destinoNombre) {
            locationText = destinoNombre;
        } else if (origenNombre) {
            locationText = origenNombre;
        }

        const tipoViaje = detalle.tipo_viaje === "SOLO_IDA" ? "Solo ida" : detalle.tipo_viaje === "IDA_Y_VUELTA" ? "Ida y vuelta" : null;
        
        const metadata = (detalle.metadata_servicio as Record<string, any>) || {};
        const aerolineaName = metadata.aerolinea || detalle.aerolineas?.nombre;

        return (
            <div key={String(detalle.id)} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex relative group hover:shadow-md transition-shadow">
                <div className={`w-1.5 ${colors.border} absolute left-0 top-0 bottom-0`} />
                <div className="p-6 pl-8 w-full flex items-start gap-5">
                    <div className={`w-11 h-11 rounded-full ${colors.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-3">
                                <h4 className="font-bold text-slate-800 text-base">{serviceName}</h4>
                                {tipoViaje && (
                                    <span className="px-2 py-0.5 bg-sky-50 text-sky-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                                        {tipoViaje}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-slate-800 text-base">Q{Number(detalle.precio_unitario).toFixed(2)}</p>
                                <button
                                    onClick={() => setEditingDetalle(detalle)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-[#0367A6] hover:bg-blue-50/50 rounded-md transition-all"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingDetalleId(detalle.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        {locationText && <p className="text-sm text-slate-600 mb-4 font-medium">{locationText}</p>}
                        <div className="flex items-center gap-5 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-400" /> {detalle.cantidad_pasajeros} pax
                            </span>
                            {aerolineaName && (
                                <span className="flex items-center gap-1.5">
                                    <Plane className="w-3.5 h-3.5 text-slate-400" /> {aerolineaName}
                                </span>
                            )}
                            {detalle.operadores_proveedores && (
                                <span className="flex items-center gap-1.5">
                                    {detalle.operadores_proveedores.nombre}
                                </span>
                            )}
                        </div>
                        {detalle.detalles_especificos && (
                            <p className="text-xs text-slate-400 mt-4 italic">
                                {detalle.detalles_especificos}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
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
                                    <p className="text-sm text-slate-500">
                                        {detalles.length} servicio{detalles.length !== 1 ? "s" : ""} incluido{detalles.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsPickerOpen(true)}
                                    className="bg-[#facc15] hover:bg-[#eab308] text-slate-900 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4 stroke-[3]" />
                                    Agregar servicio
                                </button>
                            </div>

                            {detallesQuery.isLoading ? (
                                <div className="py-12 text-center text-slate-500 animate-pulse">Cargando detalles...</div>
                            ) : detalles.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                    <p className="text-sm font-medium">No hay servicios agregados aún.</p>
                                    <p className="text-xs mt-1">Presiona &quot;Agregar servicio&quot; para comenzar.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {detalles.map(renderDetalleCard)}
                                </div>
                            )}
                        </div>
                    </DialogPrimitive.Popup>
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>

            <ServicePickerModal
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                servicios={serviciosQuery.data || []}
                isLoading={serviciosQuery.isLoading}
                onConfirm={handleServicesPicked}
            />

            {selectedServices.length > 0 && (
                <DetalleVentaWizard
                    isOpen={isWizardOpen}
                    onClose={() => {
                        setIsWizardOpen(false);
                        setSelectedServices([]);
                    }}
                    selectedServices={selectedServices}
                    ventaId={venta.id}
                    paises={paisesQuery.data || []}
                    aerolineas={aerolineasQuery.data || []}
                    proveedores={proveedoresQuery.data || []}
                    onComplete={handleWizardComplete}
                    isPending={createDetallesBulk.isPending}
                />
            )}

            <DetalleVentaEditModal
                isOpen={!!editingDetalle}
                onClose={() => setEditingDetalle(null)}
                detalle={editingDetalle}
                paises={paisesQuery.data || []}
                aerolineas={aerolineasQuery.data || []}
                proveedores={proveedoresQuery.data || []}
                onConfirm={(updatedData) => {
                    if (editingDetalle) {
                        updateDetalle.mutate(
                            { id: editingDetalle.id, data: updatedData },
                            {
                                onSuccess: () => setEditingDetalle(null),
                            }
                        );
                    }
                }}
                isPending={updateDetalle.isPending}
            />

            <ConfirmModal
                isOpen={!!deletingDetalleId}
                onClose={() => setDeletingDetalleId(null)}
                onConfirm={handleDeleteConfirm}
                isPending={deleteDetalle.isPending}
                title="¿Eliminar detalle?"
                description="¿Deseas eliminar este servicio de la venta?"
                confirmText="Eliminar"
            />
        </>
    );
}
