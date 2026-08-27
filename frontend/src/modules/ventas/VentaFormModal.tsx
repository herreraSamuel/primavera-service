import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/FormInput";
import { useVentas } from "./useVentas";
import { ApiError } from "@/lib/api";
import { ventaSchema, type Venta, type CreateVentaDTO, type VentaFormValues } from "@agency/shared";
import { clientsService } from "@/services/client.service";
import { useEffect, useState } from "react";

interface VentaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    ventaToEdit?: Venta | null;
}

export function VentaFormModal({ isOpen, onClose, ventaToEdit }: VentaFormModalProps) {
    const { createVenta, updateVenta, clientsQuery } = useVentas();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        control,
        formState: { errors },
    } = useForm<VentaFormValues>({
        resolver: zodResolver(ventaSchema),
        defaultValues: {
            numero_recibo: "",
            fecha_venta: new Date().toISOString().split('T')[0],
            cliente_id: "",
            monto_recibo: 0,
            monto_neto: 0,
            comision_operador: null,
            metodo_pago: "EFECTIVO",
        }
    });

    const [selectedClientOption, setSelectedClientOption] = useState<{value: string, label: string} | null>(null);

    useEffect(() => {
        if (isOpen) {
            createVenta.reset();
            updateVenta.reset();
            if (ventaToEdit) {
                reset({
                    numero_recibo: ventaToEdit.numero_recibo,
                    fecha_venta: new Date(ventaToEdit.fecha_venta).toISOString().split('T')[0],
                    cliente_id: ventaToEdit.cliente_id.toString(),
                    monto_recibo: ventaToEdit.monto_recibo,
                    monto_neto: ventaToEdit.monto_neto,
                    comision_operador: ventaToEdit.comision_operador ?? null,
                    metodo_pago: ventaToEdit.metodo_pago,
                });
                
                if (ventaToEdit.clientes) {
                    setSelectedClientOption({
                        value: ventaToEdit.cliente_id.toString(),
                        label: `${ventaToEdit.clientes.primer_nombre} ${ventaToEdit.clientes.primer_apellido}`
                    });
                } else {
                    setSelectedClientOption({ value: ventaToEdit.cliente_id.toString(), label: "Cliente Seleccionado" });
                }
            } else {
                reset({
                    numero_recibo: "",
                    fecha_venta: new Date().toISOString().split('T')[0],
                    cliente_id: "",
                    monto_recibo: 0,
                    monto_neto: 0,
                    comision_operador: null,
                    metodo_pago: "EFECTIVO",
                });
                setSelectedClientOption(null);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ventaToEdit, isOpen, reset]);

    const isPending = createVenta.isPending || updateVenta.isPending;
    const mutationError = createVenta.error || updateVenta.error;

    const onSubmit = (data: VentaFormValues) => {
        createVenta.reset();
        updateVenta.reset();

        const cleanedData: CreateVentaDTO = {
            numero_recibo: data.numero_recibo.trim(),
            fecha_venta: new Date(data.fecha_venta).toISOString(),
            cliente_id: Number(data.cliente_id),
            monto_recibo: Number(data.monto_recibo),
            monto_neto: Number(data.monto_neto),
            comision_operador: data.comision_operador ? Number(data.comision_operador) : null,
            metodo_pago: data.metodo_pago,
        };

        const handleMutationError = (err: unknown) => {
            if (err instanceof ApiError && err.errors) {
                err.errors.forEach((fieldErr) => {
                    if (fieldErr.field && fieldErr.field in data) {
                        setError(fieldErr.field as keyof VentaFormValues, {
                            type: "server",
                            message: fieldErr.message,
                        });
                    }
                });
            }
        };

        if (ventaToEdit) {
            updateVenta.mutate(
                { id: ventaToEdit.id, data: cleanedData },
                {
                    onSuccess: () => {
                        reset();
                        onClose();
                    },
                    onError: handleMutationError,
                }
            );
        } else {
            createVenta.mutate(cleanedData, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: handleMutationError,
            });
        }
    };

    const loadOptions = async (inputValue: string) => {
        try {
            const response = await clientsService.getAll(1, 50, inputValue);
            return response.data.map(client => {
                const docText = client.documento_identidad ? `(CUI: ${client.documento_identidad})` : client.nit ? `(NIT: ${client.nit})` : '';
                return {
                    value: client.id.toString(),
                    label: `${client.primer_nombre} ${client.segundo_nombre || ''} ${client.primer_apellido} ${client.segundo_apellido || ''} ${docText}`.replace(/\s+/g, ' ').trim()
                };
            });
        } catch (error) {
            console.error("Error loading clients:", error);
            return [];
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-8 sm:rounded-2xl border-0 shadow-2xl" showCloseButton={false}>
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {ventaToEdit ? "Editar Venta" : "Nueva Venta"}
                    </DialogTitle>
                </DialogHeader>

                {mutationError && (
                    <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20 flex items-start gap-2">
                        <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Error al guardar venta</p>
                            <p className="text-xs opacity-90">{mutationError.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormInput
                            id="numero_recibo"
                            label="Número de Recibo"
                            required
                            error={errors.numero_recibo?.message}
                            disabled={isPending}
                            {...register("numero_recibo")}
                        />
                        <FormInput
                            id="fecha_venta"
                            label="Fecha de Venta"
                            type="date"
                            required
                            error={errors.fecha_venta?.message}
                            disabled={isPending}
                            {...register("fecha_venta")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cliente_id" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cliente <span className="text-red-500">*</span></Label>
                        <Controller
                            name="cliente_id"
                            control={control}
                            render={({ field }) => (
                                <AsyncSelect
                                    {...field}
                                    id="cliente_id"
                                    isDisabled={isPending}
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadOptions}
                                    value={
                                        field.value 
                                            ? selectedClientOption 
                                                ? selectedClientOption 
                                                : { value: field.value.toString(), label: "Cliente seleccionado" }
                                            : null
                                    }
                                    onChange={(option: any) => {
                                        field.onChange(option?.value || "");
                                        setSelectedClientOption(option || null);
                                    }}
                                    placeholder="Buscar o seleccionar cliente..."
                                    noOptionsMessage={({ inputValue }) => inputValue ? "No se encontraron clientes" : "Escribe para buscar..."}
                                    loadingMessage={() => "Buscando..."}
                                    classNames={{
                                        control: (state) => `h-11 rounded-xl border ${state.isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'} bg-white text-sm shadow-sm transition-all hover:border-slate-300`,
                                        menu: () => "rounded-xl border border-slate-200 shadow-lg mt-1 bg-white text-sm z-50",
                                        option: (state) => `px-3 py-2 cursor-pointer ${state.isFocused ? 'bg-slate-100' : ''} ${state.isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-slate-700'}`,
                                        placeholder: () => "text-slate-400",
                                        singleValue: () => "text-slate-700",
                                        input: () => "text-slate-700",
                                        indicatorSeparator: () => "hidden",
                                    }}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            border: 0,
                                            boxShadow: 'none',
                                            '&:hover': { border: 0 },
                                        }),
                                        input: (base) => ({
                                            ...base,
                                            'input:focus': {
                                                boxShadow: 'none',
                                            }
                                        })
                                    }}
                                />
                            )}
                        />
                        {errors.cliente_id && (
                            <p className="text-[11px] font-medium text-[#FF6347]">{errors.cliente_id.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <FormInput
                            id="monto_recibo"
                            label="Monto del Recibo"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            error={errors.monto_recibo?.message}
                            disabled={isPending}
                            {...register("monto_recibo")}
                        />
                        <FormInput
                            id="monto_neto"
                            label="Monto Neto"
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            error={errors.monto_neto?.message}
                            disabled={isPending}
                            {...register("monto_neto")}
                        />
                        <FormInput
                            id="comision_operador"
                            label="Comisión Operador"
                            type="number"
                            step="0.01"
                            min="0"
                            error={errors.comision_operador?.message}
                            disabled={isPending}
                            {...register("comision_operador")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="metodo_pago" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Método de Pago <span className="text-red-500">*</span></Label>
                        <select
                            id="metodo_pago"
                            {...register("metodo_pago")}
                            aria-invalid={!!errors.metodo_pago}
                            disabled={isPending}
                            className="bg-white h-11 rounded-xl border border-slate-200 px-3 w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-700 text-sm shadow-sm transition-all"
                        >
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TARJETA">Tarjeta</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                        {errors.metodo_pago && (
                            <p className="text-[11px] font-medium text-[#FF6347]">{errors.metodo_pago.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={isPending}
                            className="h-12 rounded-xl border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                        >
                            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? (ventaToEdit ? "Actualizando..." : "Creando...") : (ventaToEdit ? "Guardar Cambios" : "Crear Venta")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
