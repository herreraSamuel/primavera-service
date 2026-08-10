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
    const { createClient, updateClient } = useClients();

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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="primer_nombre">Primer Nombre *</Label>
                            <Input
                                id="primer_nombre"
                                {...register("primer_nombre")}
                                aria-invalid={!!errors.primer_nombre}
                                disabled={isPending}
                            />
                            {errors.primer_nombre && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.primer_nombre.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="segundo_nombre">Segundo Nombre</Label>
                            <Input
                                id="segundo_nombre"
                                {...register("segundo_nombre")}
                                aria-invalid={!!errors.segundo_nombre}
                                disabled={isPending}
                            />
                            {errors.segundo_nombre && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.segundo_nombre.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="primer_apellido">Primer Apellido *</Label>
                            <Input
                                id="primer_apellido"
                                {...register("primer_apellido")}
                                aria-invalid={!!errors.primer_apellido}
                                disabled={isPending}
                            />
                            {errors.primer_apellido && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.primer_apellido.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
                            <Input
                                id="segundo_apellido"
                                {...register("segundo_apellido")}
                                aria-invalid={!!errors.segundo_apellido}
                                disabled={isPending}
                            />
                            {errors.segundo_apellido && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.segundo_apellido.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="documento_identidad">Documento de Identidad (DPI/Pasaporte)</Label>
                            <Input
                                id="documento_identidad"
                                {...register("documento_identidad")}
                                aria-invalid={!!errors.documento_identidad}
                                disabled={isPending}
                            />
                            {errors.documento_identidad && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.documento_identidad.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="nit">NIT</Label>
                            <Input
                                id="nit"
                                {...register("nit")}
                                aria-invalid={!!errors.nit}
                                disabled={isPending}
                            />
                            {errors.nit && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.nit.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono"
                                {...register("telefono")}
                                aria-invalid={!!errors.telefono}
                                disabled={isPending}
                            />
                            {errors.telefono && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.telefono.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="correo_electronico">Correo Electrónico</Label>
                            <Input
                                id="correo_electronico"
                                type="email"
                                {...register("correo_electronico")}
                                aria-invalid={!!errors.correo_electronico}
                                disabled={isPending}
                            />
                            {errors.correo_electronico && (
                                <p className="text-xs font-medium text-destructive">
                                    {errors.correo_electronico.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                            id="direccion"
                            {...register("direccion")}
                            aria-invalid={!!errors.direccion}
                            disabled={isPending}
                        />
                        {errors.direccion && (
                            <p className="text-xs font-medium text-destructive">
                                {errors.direccion.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
