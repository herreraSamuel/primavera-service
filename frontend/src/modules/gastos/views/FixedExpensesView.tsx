import { useState } from "react";
import { formatCurrency } from "../useExpenses";
import { 
    FixedExpenseWithRecords, 
    ExpenseType,
    CreateFixedCatalogPayload,
    UpdateFixedCatalogPayload 
} from "@/types/expense";
import { 
    Check, 
    Edit2, 
    X, 
    Loader2, 
    DollarSign, 
    Plus, 
    Settings2, 
    Trash2, 
    AlertCircle, 
    Sparkles 
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FixedExpensesViewProps {
    expenses: FixedExpenseWithRecords[];
    categories: ExpenseType[];
    onConfirm: (id: number, monto: number) => void;
    isConfirming: boolean;
    onUpdateAmount: (recordId: string | number, monto: number) => void;
    isUpdating: boolean;
    monthName: string;
    onCreateFixedCatalog?: (payload: CreateFixedCatalogPayload) => Promise<any>;
    isCreatingFixedCatalog?: boolean;
    onUpdateFixedCatalog?: (id: number, payload: UpdateFixedCatalogPayload) => Promise<any>;
    isUpdatingFixedCatalog?: boolean;
    onDeleteFixedCatalog?: (id: number) => Promise<any>;
    isDeletingFixedCatalog?: boolean;
}

const FRECUENCIAS = [
    { value: "MENSUAL", label: "Mensual" },
    { value: "QUINCENAL", label: "Quincenal" },
    { value: "SEMANAL", label: "Semanal" },
    { value: "TRIMESTRAL", label: "Trimestral" },
    { value: "SEMESTRAL", label: "Semestral" },
    { value: "ANUAL", label: "Anual" }
] as const;

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}/${month}`;
}

export function FixedExpensesView({ 
    expenses, 
    categories,
    onConfirm, 
    isConfirming,
    onUpdateAmount,
    isUpdating,
    monthName,
    onCreateFixedCatalog,
    isCreatingFixedCatalog = false,
    onUpdateFixedCatalog,
    isUpdatingFixedCatalog = false,
    onDeleteFixedCatalog,
    isDeletingFixedCatalog = false
}: FixedExpensesViewProps) {
    const [editingState, setEditingState] = useState<{
        catalogId: number;
        recordId?: string | number;
        isConfirmed: boolean;
        amount: string;
    } | null>(null);

    const [customPendingAmounts, setCustomPendingAmounts] = useState<Record<number, number>>({});
    const [confirmingExpense, setConfirmingExpense] = useState<{ id: number, monto: number } | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createNombre, setCreateNombre] = useState("");
    const [createCategoriaSelect, setCreateCategoriaSelect] = useState("");
    const [createCustomCategoria, setCreateCustomCategoria] = useState("");
    const [createMontoBase, setCreateMontoBase] = useState("");
    const [createFrecuencia, setCreateFrecuencia] = useState<typeof FRECUENCIAS[number]["value"]>("MENSUAL");

    const [editingCatalogExpense, setEditingCatalogExpense] = useState<FixedExpenseWithRecords | null>(null);
    const [editNombre, setEditNombre] = useState("");
    const [editCategoriaSelect, setEditCategoriaSelect] = useState("");
    const [editCustomCategoria, setEditCustomCategoria] = useState("");
    const [editMontoBase, setEditMontoBase] = useState("");
    const [editFrecuencia, setEditFrecuencia] = useState<typeof FRECUENCIAS[number]["value"]>("MENSUAL");

    const [deletingCatalogExpense, setDeletingCatalogExpense] = useState<FixedExpenseWithRecords | null>(null);

    const handleStartEditing = (catalogId: number, currentAmount: number, recordId?: string | number, isConfirmed: boolean = false) => {
        setEditingState({
            catalogId,
            recordId,
            isConfirmed,
            amount: currentAmount.toString()
        });
    };

    const handleCancelEditing = () => {
        setEditingState(null);
    };

    const handleSaveAmount = (catalogId: number) => {
        if (!editingState) return;
        const newAmount = parseFloat(editingState.amount);
        if (isNaN(newAmount) || newAmount <= 0) return;

        if (editingState.isConfirmed && editingState.recordId) {
            onUpdateAmount(editingState.recordId, newAmount);
        } else {
            setCustomPendingAmounts(prev => ({ ...prev, [catalogId]: newAmount }));
        }

        setEditingState(null);
    };

    const handleConfirmClick = (id: number, monto: number) => {
        setConfirmingExpense({ id, monto });
    };

    const confirmPayment = () => {
        if (confirmingExpense) {
            onConfirm(confirmingExpense.id, confirmingExpense.monto);
            setConfirmingExpense(null);
        }
    };

    const handleOpenCreateModal = () => {
        setCreateNombre("");
        const defaultCat = categories.length > 0 ? categories[0].nombre : "";
        setCreateCategoriaSelect(defaultCat);
        setCreateCustomCategoria("");
        setCreateMontoBase("");
        setCreateFrecuencia("MENSUAL");
        setIsCreateOpen(true);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onCreateFixedCatalog) return;

        const numMonto = parseFloat(createMontoBase);
        if (isNaN(numMonto) || numMonto <= 0) return;

        const finalCat = createCategoriaSelect === "__OTRA__" 
            ? createCustomCategoria.trim() 
            : (createCategoriaSelect || "General");

        if (!finalCat) return;

        try {
            await onCreateFixedCatalog({
                nombre: createNombre.trim(),
                categoria: finalCat,
                monto_base: numMonto,
                frecuencia: createFrecuencia
            });
            setIsCreateOpen(false);
        } catch (err) {
            console.error("Error al crear gasto fijo:", err);
        }
    };

    const handleOpenEditModal = (expense: FixedExpenseWithRecords) => {
        setEditingCatalogExpense(expense);
        setEditNombre(expense.nombre);
        const catName = expense.tipos_gasto?.nombre || "";
        const exists = categories.some(c => c.nombre.toLowerCase() === catName.toLowerCase());
        if (exists) {
            setEditCategoriaSelect(catName);
            setEditCustomCategoria("");
        } else if (catName) {
            setEditCategoriaSelect("__OTRA__");
            setEditCustomCategoria(catName);
        } else {
            setEditCategoriaSelect(categories.length > 0 ? categories[0].nombre : "");
            setEditCustomCategoria("");
        }
        setEditMontoBase(expense.monto_base ? expense.monto_base.toString() : "");
        setEditFrecuencia((expense.frecuencia as any) || "MENSUAL");
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onUpdateFixedCatalog || !editingCatalogExpense) return;

        const numMonto = parseFloat(editMontoBase);
        if (isNaN(numMonto) || numMonto <= 0) return;

        const finalCat = editCategoriaSelect === "__OTRA__" 
            ? editCustomCategoria.trim() 
            : (editCategoriaSelect || "General");

        try {
            await onUpdateFixedCatalog(editingCatalogExpense.id, {
                nombre: editNombre.trim(),
                categoria: finalCat,
                monto_base: numMonto,
                frecuencia: editFrecuencia
            });
            setEditingCatalogExpense(null);
        } catch (err) {
            console.error("Error al actualizar gasto fijo:", err);
        }
    };

    const handleDeleteSubmit = async () => {
        if (!onDeleteFixedCatalog || !deletingCatalogExpense) return;
        try {
            await onDeleteFixedCatalog(deletingCatalogExpense.id);
            setDeletingCatalogExpense(null);
            setEditingCatalogExpense(null);
        } catch (err) {
            console.error("Error al eliminar gasto fijo:", err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Catálogo de Gastos Fijos</h3>
                    <p className="text-xs text-slate-500">
                        Gastos fijos y recurrentes programados para el período de <strong className="text-slate-700">{monthName}</strong>
                    </p>
                </div>
                {onCreateFixedCatalog && (
                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FDBA31] hover:bg-[#f0ac1f] text-[#0F1923] font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] self-start sm:self-auto cursor-pointer"
                    >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Nuevo Gasto Fijo
                    </button>
                )}
            </div>

            {expenses.map((expense) => {
                const isConfirmed = expense.registro_gastos.length > 0;
                const record = isConfirmed ? expense.registro_gastos[0] : null;
                const formattedDate = record ? formatDate(record.fecha) : "";

                const baseAmount = Number(expense.monto_base || 0);
                const currentAmount = isConfirmed 
                    ? Number(record?.monto || baseAmount) 
                    : (customPendingAmounts[expense.id] ?? baseAmount);

                const isCurrentlyEditing = editingState?.catalogId === expense.id;

                return (
                    <div 
                        key={expense.id} 
                        className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full shrink-0 ${isConfirmed ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-500 ring-4 ring-amber-100'}`}></div>
                            <div>
                                <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                                    <h4 className="font-bold text-slate-900 text-lg">{expense.nombre}</h4>
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                        {expense.tipos_gasto?.nombre || "General"}
                                    </span>
                                    {onUpdateFixedCatalog && (
                                        <button
                                            onClick={() => handleOpenEditModal(expense)}
                                            className="text-slate-400 hover:text-amber-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                                            title="Configurar plantilla (editar nombre, cuota base sugerida o dar de baja)"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    {expense.tipos_gasto?.nombre ? `Gasto fijo: ${expense.tipos_gasto.nombre}` : "Gasto fijo recurrente"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end md:space-x-12">
                            <div className="flex flex-col items-center">
                                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Frecuencia</span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                    {expense.frecuencia ? expense.frecuencia.charAt(0).toUpperCase() + expense.frecuencia.slice(1).toLowerCase() : "Mensual"}
                                </span>
                            </div>
                            
                            <div className="flex flex-col items-end min-w-[140px]">
                                <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-1">Monto</span>
                                
                                {isCurrentlyEditing ? (
                                    <div className="flex items-center gap-1.5">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={editingState.amount}
                                            onChange={(e) => setEditingState({ ...editingState, amount: e.target.value })}
                                            className="w-24 px-2 py-1 border border-amber-500 rounded text-right text-sm font-bold text-slate-900 focus:outline-none"
                                            autoFocus
                                        />
                                        <button 
                                            onClick={() => handleSaveAmount(expense.id)}
                                            disabled={isUpdating}
                                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                            title="Guardar monto"
                                        >
                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            onClick={handleCancelEditing}
                                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                                            title="Cancelar"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group">
                                        <span className="font-bold text-slate-900 text-lg">
                                            {formatCurrency(currentAmount)}
                                        </span>
                                        <button 
                                            onClick={() => handleStartEditing(expense.id, currentAmount, record?.id, isConfirmed)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-600 transition-opacity p-1 rounded hover:bg-slate-50 cursor-pointer"
                                            title="Ajustar monto para este mes"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-[170px] flex justify-end">
                                {isConfirmed ? (
                                    <div className="flex items-center text-emerald-600 font-semibold text-sm bg-emerald-50/60 px-3 py-1.5 rounded-lg border border-emerald-200">
                                        <Check className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                                        Confirmado el {formattedDate}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleConfirmClick(expense.id, currentAmount)}
                                        disabled={isConfirming}
                                        className="px-5 py-2 rounded-lg border-2 border-amber-500 text-amber-600 font-semibold text-sm hover:bg-amber-500 hover:text-slate-950 transition-all disabled:opacity-50 shadow-sm cursor-pointer"
                                    >
                                        {isConfirming ? "Confirmando..." : "Confirmar pago"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {expenses.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                    <p className="text-slate-400 text-sm">No hay gastos fijos configurados en el catálogo.</p>
                    {onCreateFixedCatalog && (
                        <button
                            onClick={handleOpenCreateModal}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
                        >
                            <Plus className="w-4 h-4" />
                            Crear el primer gasto fijo
                        </button>
                    )}
                </div>
            )}

            <Dialog open={!!confirmingExpense} onOpenChange={(open) => !open && !isConfirming && setConfirmingExpense(null)}>
                <DialogContent className="sm:max-w-[420px] p-8 sm:rounded-3xl border-0 shadow-2xl flex flex-col items-center text-center" showCloseButton={false}>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                        <DollarSign className="w-6 h-6 stroke-[2]" />
                    </div>
                    
                    <DialogHeader className="flex flex-col items-center">
                        <DialogTitle className="text-xl font-bold text-slate-900 mb-1">
                            Confirmar Pago
                        </DialogTitle>
                        <DialogDescription className="text-[15px] text-slate-500">
                            ¿Está seguro que desea registrar este gasto fijo para el mes de <strong className="text-slate-700">{monthName}</strong>?
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="mt-6 w-full grid grid-cols-2 gap-4">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => setConfirmingExpense(null)} 
                            disabled={isConfirming}
                            className="h-12 rounded-xl text-slate-700 font-semibold border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="button"
                            onClick={confirmPayment} 
                            disabled={isConfirming}
                            className="h-12 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                        >
                            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isConfirming ? "Confirmando..." : "Sí, registrar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isCreateOpen} onOpenChange={(open) => !open && !isCreatingFixedCatalog && setIsCreateOpen(false)}>
                <DialogContent className="sm:max-w-[480px] p-6 sm:p-7 sm:rounded-3xl border-0 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold">
                                <Sparkles className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900">
                                    Nuevo Gasto Fijo
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Aparecerá cada mes en la lista para que solo tengan que confirmar su pago.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4 mt-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nombre del Gasto Fijo *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Renta de Oficina, Internet Fibra, etc."
                                value={createNombre}
                                onChange={(e) => setCreateNombre(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Categoría *
                                </label>
                                <select
                                    value={createCategoriaSelect}
                                    onChange={(e) => setCreateCategoriaSelect(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.nombre}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                    <option value="__OTRA__">+ Otra categoría...</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Frecuencia *
                                </label>
                                <select
                                    value={createFrecuencia}
                                    onChange={(e) => setCreateFrecuencia(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {FRECUENCIAS.map((f) => (
                                        <option key={f.value} value={f.value}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {createCategoriaSelect === "__OTRA__" && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nombre de la nueva categoría *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Licencias de Software, Seguros..."
                                    value={createCustomCategoria}
                                    onChange={(e) => setCreateCustomCategoria(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Monto Base Estimado (Q) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                placeholder="0.00"
                                value={createMontoBase}
                                onChange={(e) => setCreateMontoBase(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                                Será el valor sugerido que aparecerá cada mes. Al confirmarlo se puede ajustar si ese mes varió.
                            </p>
                        </div>

                        <DialogFooter className="mt-6 pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsCreateOpen(false)}
                                disabled={isCreatingFixedCatalog}
                                className="rounded-xl border-slate-200 cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isCreatingFixedCatalog}
                                className="rounded-xl bg-[#FDBA31] hover:bg-[#f0ac1f] text-[#0F1923] font-bold cursor-pointer"
                            >
                                {isCreatingFixedCatalog && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isCreatingFixedCatalog ? "Guardando..." : "Crear Gasto Fijo"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog 
                open={!!editingCatalogExpense} 
                onOpenChange={(open) => !open && !isUpdatingFixedCatalog && setEditingCatalogExpense(null)}
            >
                <DialogContent className="sm:max-w-[480px] p-6 sm:p-7 sm:rounded-3xl border-0 shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                                <Settings2 className="w-5 h-5 text-slate-700" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900">
                                    Editar Gasto Fijo
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Modifica la plantilla general o cuota sugerida para este servicio.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4 mt-3">
                        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <strong className="font-semibold">Historial protegido:</strong> Si modificas el monto base, aplicará como cuota sugerida para los meses futuros o pendientes. Los meses anteriores que ya fueron confirmados se mantendrán con su monto original sin alteraciones.
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Nombre del Gasto Fijo *
                            </label>
                            <input
                                type="text"
                                required
                                value={editNombre}
                                onChange={(e) => setEditNombre(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Categoría *
                                </label>
                                <select
                                    value={editCategoriaSelect}
                                    onChange={(e) => setEditCategoriaSelect(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.nombre}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                    <option value="__OTRA__">+ Otra categoría...</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Frecuencia *
                                </label>
                                <select
                                    value={editFrecuencia}
                                    onChange={(e) => setEditFrecuencia(e.target.value as any)}
                                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {FRECUENCIAS.map((f) => (
                                        <option key={f.value} value={f.value}>
                                            {f.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {editCategoriaSelect === "__OTRA__" && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Nombre de la nueva categoría *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Licencias de Software, Seguros..."
                                    value={editCustomCategoria}
                                    onChange={(e) => setEditCustomCategoria(e.target.value)}
                                    className="w-full px-3.5 py-2.5 border border-amber-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Monto Base / Cuota sugerida (Q) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                required
                                value={editMontoBase}
                                onChange={(e) => setEditMontoBase(e.target.value)}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                            />
                        </div>

                        <DialogFooter className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {onDeleteFixedCatalog && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDeletingCatalogExpense(editingCatalogExpense);
                                    }}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Dar de baja
                                </button>
                            )}

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => setEditingCatalogExpense(null)}
                                    disabled={isUpdatingFixedCatalog}
                                    className="rounded-xl border-slate-200 cursor-pointer"
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isUpdatingFixedCatalog}
                                    className="rounded-xl bg-[#FDBA31] hover:bg-[#f0ac1f] text-[#0F1923] font-bold cursor-pointer"
                                >
                                    {isUpdatingFixedCatalog && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isUpdatingFixedCatalog ? "Guardando..." : "Guardar Cambios"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog 
                open={!!deletingCatalogExpense} 
                onOpenChange={(open) => !open && !isDeletingFixedCatalog && setDeletingCatalogExpense(null)}
            >
                <DialogContent className="sm:max-w-[420px] p-7 sm:rounded-3xl border-0 shadow-2xl flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-2">
                        <Trash2 className="w-6 h-6 stroke-[2]" />
                    </div>
                    
                    <DialogHeader className="flex flex-col items-center">
                        <DialogTitle className="text-xl font-bold text-slate-900 mb-1">
                            ¿Dar de baja este gasto fijo?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            <strong>{deletingCatalogExpense?.nombre}</strong> ya no aparecerá como pendiente en los próximos meses. Todos los pagos ya confirmados en meses anteriores seguirán guardados en tus reportes.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <DialogFooter className="mt-6 w-full grid grid-cols-2 gap-3">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => setDeletingCatalogExpense(null)} 
                            disabled={isDeletingFixedCatalog}
                            className="h-11 rounded-xl text-slate-700 font-semibold border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleDeleteSubmit} 
                            disabled={isDeletingFixedCatalog}
                            className="h-11 rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer"
                        >
                            {isDeletingFixedCatalog && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isDeletingFixedCatalog ? "Dando de baja..." : "Sí, dar de baja"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
