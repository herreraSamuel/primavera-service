import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    clientName: string;
}

export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    clientName,
}: ConfirmDeleteModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="sm:max-w-[420px] p-8 sm:rounded-3xl border-0 shadow-2xl flex flex-col items-center text-center" showCloseButton={false}>
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <Trash2 className="w-6 h-6 stroke-[2]" />
                </div>
                
                <DialogHeader className="flex flex-col items-center">
                    <DialogTitle className="text-xl font-bold text-slate-900 mb-1">
                        ¿Estás seguro?
                    </DialogTitle>
                    <DialogDescription className="text-[15px] text-slate-500 flex flex-col gap-1 items-center">
                        <span>¿Deseas eliminar a <span className="font-semibold text-slate-900">{clientName}</span>?</span>
                        <span>Esta acción no se puede revertir.</span>
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="mt-6 w-full grid grid-cols-2 gap-4">
                    <Button 
                        type="button"
                        variant="outline" 
                        onClick={onClose} 
                        disabled={isPending}
                        className="h-12 rounded-xl text-slate-700 font-semibold border-slate-200 hover:bg-slate-50"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="button"
                        variant="destructive" 
                        onClick={onConfirm} 
                        disabled={isPending}
                        className="h-12 rounded-xl font-semibold bg-[#FA4A4A] hover:bg-[#FA4A4A]/90 text-white shadow-sm"
                    >
                        {isPending ? "Eliminando..." : "Eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
