import { formatCurrency, MONTHS } from "../useExpenses";
import { PageHeader } from "@/components/ui/PageHeader";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface ExpensesTopCardsProps {
    fixedConfirmed: number;
    variables: number;
    total: number;
    fixedPendingCount: number;
    variableCount: number;
    month: number;
    year: number;
    setMonth: (month: number) => void;
    setYear: (year: number) => void;
}

export function ExpensesTopCards({
    fixedConfirmed,
    variables,
    total,
    fixedPendingCount,
    variableCount,
    month,
    year,
    setMonth,
    setYear
}: ExpensesTopCardsProps) {
    const monthName = MONTHS[month - 1];

    const handlePrevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gastos"
                description="Control de gastos fijos y variables del negocio."
                action={
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white px-2 py-1.5 shadow-sm">
                        <button 
                            onClick={handlePrevMonth} 
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="mx-3 font-semibold text-slate-700 text-sm min-w-[110px] text-center">
                            {monthName} {year}
                        </div>
                        <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                        <button 
                            onClick={handleNextMonth} 
                            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-500 border-l border-slate-100 pl-2"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
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
                        {variableCount} registro(s) en {monthName.toLowerCase()} de {year}
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
                        {monthName} de {year}
                    </div>
                </div>
            </div>
        </div>
    );
}
