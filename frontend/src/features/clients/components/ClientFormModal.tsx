import { useEffect, useState } from "react";
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
import type { Client, CreateClientDTO } from "@agency/shared";

interface ClientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientToEdit?: Client | null;
}

export function ClientFormModal({ isOpen, onClose, clientToEdit }: ClientFormModalProps) {
    const { createClient, updateClient } = useClients();

    const [formData, setFormData] = useState<CreateClientDTO>({
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

    useEffect(() => {
        if (clientToEdit && isOpen) {
            setFormData({
                primer_nombre: clientToEdit.primer_nombre || "",
                segundo_nombre: clientToEdit.segundo_nombre || "",
                primer_apellido: clientToEdit.primer_apellido || "",
                segundo_apellido: clientToEdit.segundo_apellido || "",
                nit: clientToEdit.nit || "",
                documento_identidad: clientToEdit.documento_identidad || "",
                direccion: clientToEdit.direccion || "",
                telefono: clientToEdit.telefono || "",
                correo_electronico: clientToEdit.correo_electronico || "",
                departamento_id: clientToEdit.departamento_id,
            });
        } else if (isOpen) {
            setFormData({
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
    }, [clientToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'departamento_id' ? (value ? Number(value) : null) : value
        }));
    };

    const isPending = createClient.isPending || updateClient.isPending;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.primer_nombre || !formData.primer_apellido) return;

        const cleanedData = {
            ...formData,
            segundo_nombre: formData.segundo_nombre || null,
            segundo_apellido: formData.segundo_apellido || null,
            nit: formData.nit || null,
            documento_identidad: formData.documento_identidad || null,
            direccion: formData.direccion || null,
            telefono: formData.telefono || null,
            correo_electronico: formData.correo_electronico || null,
        };

        if (clientToEdit) {
            updateClient.mutate(
                { id: clientToEdit.id, data: cleanedData },
                { onSuccess: () => onClose() }
            );
        } else {
            createClient.mutate(cleanedData, {
                onSuccess: () => onClose()
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primer_nombre">Primer Nombre *</Label>
                            <Input
                                id="primer_nombre" name="primer_nombre"
                                value={formData.primer_nombre} onChange={handleChange}
                                required disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="segundo_nombre">Segundo Nombre</Label>
                            <Input
                                id="segundo_nombre" name="segundo_nombre"
                                value={formData.segundo_nombre || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primer_apellido">Primer Apellido *</Label>
                            <Input
                                id="primer_apellido" name="primer_apellido"
                                value={formData.primer_apellido} onChange={handleChange}
                                required disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="segundo_apellido">Segundo Apellido</Label>
                            <Input
                                id="segundo_apellido" name="segundo_apellido"
                                value={formData.segundo_apellido || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="documento_identidad">Documento de Identidad (DPI/Pasaporte)</Label>
                            <Input
                                id="documento_identidad" name="documento_identidad"
                                value={formData.documento_identidad || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nit">NIT</Label>
                            <Input
                                id="nit" name="nit"
                                value={formData.nit || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                                id="telefono" name="telefono"
                                value={formData.telefono || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="correo_electronico">Correo Electrónico</Label>
                            <Input
                                id="correo_electronico" name="correo_electronico" type="email"
                                value={formData.correo_electronico || ""} onChange={handleChange}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                            id="direccion" name="direccion"
                            value={formData.direccion || ""} onChange={handleChange}
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
