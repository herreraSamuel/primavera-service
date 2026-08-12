import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/FormInput";
import { useClients } from "./useClients";
import { ApiError } from "@/lib/api";
import { clientSchema, type Client, type CreateClientDTO, type ClientFormValues } from "@agency/shared";

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientToEdit?: Client | null;
}

export function ClientFormModal({ isOpen, onClose, clientToEdit }: ClientFormModalProps) {
    const { createClient, updateClient, departamentosQuery } = useClients();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            primer_nombre: "",
            segundo_nombre: "",
            primer_apellido: "",
            segundo_apellido: "",
            nit: "",
            documento_identidad: "",
            direccion: "",
            telefono: "",
            correo_electronico: "",
            departamento_id: null,
        },
    });

    useEffect(() => {
        if (isOpen) {
            createClient.reset();
            updateClient.reset();
            if (clientToEdit) {
                reset({
                    primer_nombre: clientToEdit.primer_nombre || "",
                    segundo_nombre: clientToEdit.segundo_nombre || "",
                    primer_apellido: clientToEdit.primer_apellido || "",
                    segundo_apellido: clientToEdit.segundo_apellido || "",
                    nit: clientToEdit.nit || "",
                    documento_identidad: clientToEdit.documento_identidad || "",
                    direccion: clientToEdit.direccion || "",
                    telefono: clientToEdit.telefono || "",
                    correo_electronico: clientToEdit.correo_electronico || "",
                    departamento_id: clientToEdit.departamento_id ?? null,
                });
            } else {
                reset({
                    primer_nombre: "",
                    segundo_nombre: "",
                    primer_apellido: "",
                    segundo_apellido: "",
                    nit: "",
                    documento_identidad: "",
                    direccion: "",
                    telefono: "",
                    correo_electronico: "",
                    departamento_id: null,
                });
            }
        }
    }, [clientToEdit, isOpen, reset]);

    const isPending = createClient.isPending || updateClient.isPending;
    const mutationError = createClient.error || updateClient.error;

    const onSubmit = (data: ClientFormValues) => {
        createClient.reset();
        updateClient.reset();

        const cleanedData: CreateClientDTO = {
            primer_nombre: data.primer_nombre.trim(),
            primer_apellido: data.primer_apellido.trim(),
            segundo_nombre: data.segundo_nombre?.trim() || null,
            segundo_apellido: data.segundo_apellido?.trim() || null,
            nit: data.nit?.trim() || null,
            documento_identidad: data.documento_identidad?.trim() || null,
            direccion: data.direccion?.trim() || null,
            telefono: data.telefono?.trim() || null,
            correo_electronico: data.correo_electronico?.trim() || null,
            departamento_id: data.departamento_id ? Number(data.departamento_id) : null,
        };

        const handleMutationError = (err: unknown) => {
            if (err instanceof ApiError && err.errors) {
                err.errors.forEach((fieldErr) => {
                    if (fieldErr.field && fieldErr.field in data) {
                        setError(fieldErr.field as keyof ClientFormValues, {
                            type: "server",
                            message: fieldErr.message,
                        });
                    }
                });
            }
        };

        if (clientToEdit) {
            updateClient.mutate(
                { id: clientToEdit.id, data: cleanedData },
                {
                    onSuccess: () => {
                        reset();
                        onClose();
                    },
                    onError: handleMutationError,
                }
            );
        } else {
            createClient.mutate(cleanedData, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: handleMutationError,
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="sm:max-w-[700px] p-8 sm:rounded-2xl border-0 shadow-2xl" showCloseButton={false}>
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}
                    </DialogTitle>
                </DialogHeader>

                {mutationError && (
                    <div className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive border border-destructive/20 flex items-start gap-2">
                        <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Error al guardar cliente</p>
                            <p className="text-xs opacity-90">{mutationError.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormInput
                            id="primer_nombre"
                            label="Primer Nombre"
                            required
                            error={errors.primer_nombre?.message}
                            disabled={isPending}
                            {...register("primer_nombre")}
                        />
                        <FormInput
                            id="segundo_nombre"
                            label="Segundo Nombre"
                            error={errors.segundo_nombre?.message}
                            disabled={isPending}
                            {...register("segundo_nombre")}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormInput
                            id="primer_apellido"
                            label="Primer Apellido"
                            required
                            error={errors.primer_apellido?.message}
                            disabled={isPending}
                            {...register("primer_apellido")}
                        />
                        <FormInput
                            id="segundo_apellido"
                            label="Segundo Apellido"
                            error={errors.segundo_apellido?.message}
                            disabled={isPending}
                            {...register("segundo_apellido")}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormInput
                            id="nit"
                            label="NIT"
                            error={errors.nit?.message}
                            disabled={isPending}
                            {...register("nit")}
                        />
                        <FormInput
                            id="documento_identidad"
                            label="Documento de Identidad"
                            error={errors.documento_identidad?.message}
                            disabled={isPending}
                            {...register("documento_identidad")}
                        />
                    </div>

                    <FormInput
                        id="direccion"
                        label="Dirección"
                        error={errors.direccion?.message}
                        disabled={isPending}
                        {...register("direccion")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormInput
                            id="telefono"
                            label="Teléfono"
                            error={errors.telefono?.message}
                            disabled={isPending}
                            {...register("telefono")}
                        />
                        <FormInput
                            id="correo_electronico"
                            label="Correo Electrónico"
                            type="email"
                            error={errors.correo_electronico?.message}
                            disabled={isPending}
                            {...register("correo_electronico")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departamento_id" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Departamento</Label>
                        <select
                            id="departamento_id"
                            {...register("departamento_id")}
                            aria-invalid={!!errors.departamento_id}
                            disabled={isPending || departamentosQuery.isLoading}
                            className="bg-white h-11 rounded-xl border border-slate-200 px-3 w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slate-700 text-sm shadow-sm transition-all"
                        >
                            <option value="">Selecciona un departamento</option>
                            {departamentosQuery.isLoading ? (
                                <option value="" disabled>Cargando departamentos...</option>
                            ) : (
                                departamentosQuery.data?.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.nombre}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.departamento_id && (
                            <p className="text-[11px] font-medium text-[#FF6347]">{errors.departamento_id.message}</p>
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
                            {isPending ? (clientToEdit ? "Actualizando..." : "Creando...") : (clientToEdit ? "Guardar Cambios" : "Crear Cliente")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
