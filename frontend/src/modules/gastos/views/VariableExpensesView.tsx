import { useState } from "react";
import { formatCurrency } from "../useExpenses";
import { ExpenseRecord, ExpenseType } from "@/types/expense";
import { CreateVariableExpensePayload } from "@/services/expense.service";
import { Search, Trash2, Plus, X } from "lucide-react";

interface VariableExpensesViewProps {
    expenses: ExpenseRecord[];
    categories: ExpenseType[];
    onCreateVariable: (payload: CreateVariableExpensePayload) => void;
    isCreating: boolean;
    onDeleteExpense: (id: string | number) => void;
    isDeleting: boolean;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function VariableExpensesView({ 
    expenses, 
    categories,
    onCreateVariable, 
    isCreating,
    onDeleteExpense,
    isDeleting 
}: VariableExpensesViewProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(true);

    const [formDate, setFormDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [formCategory, setFormCategory] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formAmount, setFormAmount] = useState<string>("");

    const filteredExpenses = expenses.filter(expense => 
        (expense.descripcion_extra || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.catalogo_gastos?.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(formAmount);
        if (isNaN(numericAmount) || numericAmount <= 0) return;
        
        const finalCategory = formCategory || (categories.length > 0 ? categories[0].nombre : "Marketing");

        onCreateVariable({
            fecha: formDate,
            categoria: finalCategory,
            descripcion_extra: formDescription.trim() || undefined,
            monto: numericAmount
        });

        setFormDescription("");
        setFormAmount("");
    };

    const getCategoryBadgeClass = (category: string) => {
        const lower = category.toLowerCase();
        if (lower.includes("marketing")) return "bg-pink-50 text-pink-600";
        if (lower.includes("transporte") || lower.includes("viaje")) return "bg-sky-50 text-sky-600";
        if (lower.includes("papeler") || lower.includes("oficina")) return "bg-slate-100 text-slate-600";
        if (lower.includes("alimento") || lower.includes("comida")) return "bg-orange-50 text-orange-600";
        return "bg-blue-50 text-blue-600";
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
                <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    FECHA
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    CATEGORÍA
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    DESCRIPCIÓN
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    MONTO
                                </th>
                                <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {filteredExpenses.map((expense) => {
                                const categoryName = expense.catalogo_gastos?.tipos_gasto?.nombre || expense.catalogo_gastos?.nombre || "General";
                                const badgeClass = getCategoryBadgeClass(categoryName);

                                return (
                                    <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                            {formatDate(expense.fecha)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
                                                {categoryName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate font-medium">
                                            {expense.descripcion_extra || expense.catalogo_gastos?.nombre || "—"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                            {formatCurrency(Number(expense.monto))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button 
                                                onClick={() => onDeleteExpense(expense.id)}
                                                disabled={isDeleting}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                                                title="Eliminar gasto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredExpenses.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-sm">No se encontraron gastos variables.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-80 shrink-0">
                {isFormOpen ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">Nuevo Gasto Variable</h3>
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Fecha
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formDate}
                                        onChange={(e) => setFormDate(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Categoría
                                </label>
                                <select
                                    value={formCategory || (categories.length > 0 ? categories[0].nombre : "")}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.nombre}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                    {categories.length === 0 && (
                                        <option value="Marketing">Marketing</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Descripción
                                </label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="Detalla el gasto..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder-slate-400 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Monto (Q)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    placeholder="0"
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder-slate-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full bg-[#FDBA31] hover:bg-[#f0ac1f] text-[#0F1923] font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                            >
                                {isCreating ? "Registrando..." : "Registrar Gasto"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="w-full flex items-center justify-center py-4 px-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-semibold hover:border-amber-500 hover:text-amber-600 transition-all bg-white shadow-sm hover:shadow"
                    >
                        <Plus className="w-4 h-4 mr-2 stroke-[2.5]" />
                        Registrar gasto variable
                    </button>
                )}
            </div>
        </div>
    );
}
