import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText: string;
    isPending: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    isPending,
}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent className="sm:max-w-[420px] p-8 sm:rounded-3xl border-0 shadow-2xl flex flex-col items-center text-center" showCloseButton={false}>
                <div className="w-14 h-14 bg-red-50 text-[#FF6347] rounded-full flex items-center justify-center mb-2">
                    <Trash2 className="w-6 h-6 stroke-[2]" />
                </div>
                
                <DialogHeader className="flex flex-col items-center">
                    <DialogTitle className="text-xl font-bold text-slate-900 mb-1">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-[15px] text-slate-500 flex flex-col gap-1 items-center">
                        <span>{description}</span>
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
                        onClick={onConfirm} 
                        disabled={isPending}
                        className="h-12 rounded-xl font-semibold bg-[#FF6347] hover:bg-[#FF6347]/90 text-white shadow-sm"
                    >
                        {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Procesando..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
