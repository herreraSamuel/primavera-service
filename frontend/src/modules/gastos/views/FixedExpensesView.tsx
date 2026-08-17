import { useState } from "react";
import { formatCurrency } from "../useExpenses";
import { FixedExpenseWithRecords } from "@/types/expense";
import { Check, Edit2, X, Loader2 } from "lucide-react";

interface FixedExpensesViewProps {
    expenses: FixedExpenseWithRecords[];
    onConfirm: (id: number, monto: number) => void;
    isConfirming: boolean;
    onUpdateAmount: (recordId: string | number, monto: number) => void;
    isUpdating: boolean;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}/${month}`;
}

export function FixedExpensesView({ 
    expenses, 
    onConfirm, 
    isConfirming,
    onUpdateAmount,
    isUpdating 
}: FixedExpensesViewProps) {
    const [editingState, setEditingState] = useState<{
        catalogId: number;
        recordId?: string | number;
        isConfirmed: boolean;
        amount: string;
    } | null>(null);

    const [customPendingAmounts, setCustomPendingAmounts] = useState<Record<number, number>>({});

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

    return (
        <div className="space-y-4">
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
                                <div className="flex items-center space-x-3">
                                    <h4 className="font-bold text-slate-900 text-lg">{expense.nombre}</h4>
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                                        {expense.tipos_gasto?.nombre || "General"}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    {expense.tipos_gasto?.nombre || "Gasto fijo recurrente"}
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
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-600 transition-opacity p-1 rounded hover:bg-slate-50"
                                            title="Editar monto"
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
                                        onClick={() => onConfirm(expense.id, currentAmount)}
                                        disabled={isConfirming}
                                        className="px-5 py-2 rounded-lg border-2 border-amber-500 text-amber-600 font-semibold text-sm hover:bg-amber-500 hover:text-slate-950 transition-all disabled:opacity-50 shadow-sm"
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
                </div>
            )}
        </div>
    );
}
