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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClients } from "../hooks/useClients";
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
                        <div className="space-y-2">
                            <Label htmlFor="primer_nombre" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primer Nombre <span className="text-red-500">*</span></Label>
                            <Input
                                id="primer_nombre"
                                {...register("primer_nombre")}
                                aria-invalid={!!errors.primer_nombre}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.primer_nombre && (
                                <p className="text-[11px] font-medium text-destructive">{errors.primer_nombre.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="segundo_nombre" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Segundo Nombre</Label>
                            <Input
                                id="segundo_nombre"
                                {...register("segundo_nombre")}
                                aria-invalid={!!errors.segundo_nombre}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.segundo_nombre && (
                                <p className="text-[11px] font-medium text-destructive">{errors.segundo_nombre.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="primer_apellido" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primer Apellido <span className="text-red-500">*</span></Label>
                            <Input
                                id="primer_apellido"
                                {...register("primer_apellido")}
                                aria-invalid={!!errors.primer_apellido}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.primer_apellido && (
                                <p className="text-[11px] font-medium text-destructive">{errors.primer_apellido.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="segundo_apellido" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Segundo Apellido</Label>
                            <Input
                                id="segundo_apellido"
                                {...register("segundo_apellido")}
                                aria-invalid={!!errors.segundo_apellido}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.segundo_apellido && (
                                <p className="text-[11px] font-medium text-destructive">{errors.segundo_apellido.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="nit" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NIT</Label>
                            <Input
                                id="nit"
                                {...register("nit")}
                                aria-invalid={!!errors.nit}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.nit && (
                                <p className="text-[11px] font-medium text-destructive">{errors.nit.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="documento_identidad" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Documento de Identidad</Label>
                            <Input
                                id="documento_identidad"
                                {...register("documento_identidad")}
                                aria-invalid={!!errors.documento_identidad}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.documento_identidad && (
                                <p className="text-[11px] font-medium text-destructive">{errors.documento_identidad.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="direccion" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dirección</Label>
                        <Input
                            id="direccion"
                            {...register("direccion")}
                            aria-invalid={!!errors.direccion}
                            disabled={isPending}
                            className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                        />
                        {errors.direccion && (
                            <p className="text-[11px] font-medium text-destructive">{errors.direccion.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="telefono" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Teléfono</Label>
                            <Input
                                id="telefono"
                                {...register("telefono")}
                                aria-invalid={!!errors.telefono}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.telefono && (
                                <p className="text-[11px] font-medium text-destructive">{errors.telefono.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="correo_electronico" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</Label>
                            <Input
                                id="correo_electronico"
                                type="email"
                                {...register("correo_electronico")}
                                aria-invalid={!!errors.correo_electronico}
                                disabled={isPending}
                                className="bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
                            />
                            {errors.correo_electronico && (
                                <p className="text-[11px] font-medium text-destructive">{errors.correo_electronico.message}</p>
                            )}
                        </div>
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
                            <p className="text-[11px] font-medium text-destructive">{errors.departamento_id.message}</p>
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
