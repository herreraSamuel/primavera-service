import { formatCurrency } from "../useExpenses";
import { PageHeader } from "@/components/ui/PageHeader";

interface ExpensesTopCardsProps {
    fixedConfirmed: number;
    variables: number;
    total: number;
    fixedPendingCount: number;
    variableCount: number;
    filterMode: "mes" | "rango";
    setFilterMode: (mode: "mes" | "rango") => void;
    month: number;
    setMonth: (month: number) => void;
    year: number;
    setYear: (year: number) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    setPreset: (months: number) => void;
    periodLabel: string;
    MONTHS: string[];
    YEARS: number[];
}

export function ExpensesTopCards({
    fixedConfirmed,
    variables,
    total,
    fixedPendingCount,
    variableCount,
    filterMode,
    setFilterMode,
    month,
    setMonth,
    year,
    setYear,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPreset,
    periodLabel,
    MONTHS,
    YEARS,
}: ExpensesTopCardsProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Gastos"
                description="Control de gastos fijos y variables del negocio."
                action={
                    <div className="flex items-center gap-3">
                        <select
                            value={filterMode}
                            onChange={(e) => setFilterMode(e.target.value as "mes" | "rango")}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer shadow-sm"
                        >
                            <option value="mes">Mensual</option>
                            <option value="rango">Rango Personalizado</option>
                        </select>

                        {filterMode === "mes" ? (
                            <div className="flex items-center gap-2">
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer shadow-sm"
                                >
                                    {MONTHS.map((nombreMes, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {nombreMes}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer shadow-sm"
                                >
                                    {YEARS.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                                />
                                <span className="text-slate-400">—</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                                />
                            </div>
                        )}

                        <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                            {[
                                { label: "3M", months: 3 },
                                { label: "6M", months: 6 },
                                { label: "1A", months: 12 },
                            ].map(({ label, months: mCount }) => (
                                <button
                                    key={label}
                                    onClick={() => setPreset(mCount)}
                                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors border-r last:border-r-0 border-slate-200"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            FIJOS CONFIRMADOS
                        </span>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                            {formatCurrency(fixedConfirmed)}
                        </div>
                    </div>
                    <div className="mt-3 flex items-center text-amber-500 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 shrink-0"></div>
                        {fixedPendingCount} pendientes
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            VARIABLES
                        </span>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                            {formatCurrency(variables)}
                        </div>
                    </div>
                    <div className="mt-3 text-slate-400 text-sm">
                        {variableCount} registro(s) en {periodLabel}
                    </div>
                </div>

                <div className="bg-[#0F1923] rounded-xl border border-slate-800 p-5 flex flex-col justify-between shadow-md">
                    <div>
                        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                            TOTAL GASTOS
                        </span>
                        <div className="text-3xl font-bold text-white tracking-tight mt-1">
                            {formatCurrency(total)}
                        </div>
                    </div>
                    <div className="mt-3 text-slate-400 text-sm">
                        {periodLabel}
                    </div>
                </div>
            </div>
        </div>
    );
}
