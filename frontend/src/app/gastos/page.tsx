"use client";

import { useState } from "react";
import { useExpenses } from "@/modules/gastos/useExpenses";
import { ExpensesTopCards } from "@/modules/gastos/components/ExpensesTopCards";
import { ExpensesTabs } from "@/modules/gastos/components/ExpensesTabs";
import { FixedExpensesView } from "@/modules/gastos/views/FixedExpensesView";
import { VariableExpensesView } from "@/modules/gastos/views/VariableExpensesView";
import RoleGuard from "@/components/shared/RoleGuard";

export default function ExpensesPage() {
    const { 
        data, 
        isLoading, 
        isError, 
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
        confirmExpense,
        isConfirming,
        createVariableExpense,
        isCreatingVariable,
        updateExpense,
        isUpdating,
        deleteExpense,
        isDeleting
    } = useExpenses();

    const [activeTab, setActiveTab] = useState<'FIJOS' | 'VARIABLES'>('FIJOS');

    if (isLoading) {
        return (
            <div className="p-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-red-500 bg-red-50 rounded-xl border border-red-200">
                Error al cargar los datos de gastos.
            </div>
        );
    }

    const summary = data?.summary || {
        fixedConfirmed: 0,
        variables: 0,
        total: 0,
        fixedPendingCount: 0
    };

    const variableCount = data?.variableExpenses.length || 0;

    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            <div className="space-y-6">
                <ExpensesTopCards 
                    fixedConfirmed={summary.fixedConfirmed}
                    variables={summary.variables}
                    total={summary.total}
                    fixedPendingCount={summary.fixedPendingCount}
                    variableCount={variableCount}
                    filterMode={filterMode}
                    setFilterMode={setFilterMode}
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setYear={setYear}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    setPreset={setPreset}
                    periodLabel={periodLabel}
                    MONTHS={MONTHS}
                    YEARS={YEARS}
                />

                <ExpensesTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    fixedPendingCount={summary.fixedPendingCount} 
                />

                <div>
                    {activeTab === 'FIJOS' && (
                        <FixedExpensesView 
                            expenses={data?.fixedExpenses || []} 
                            onConfirm={(id, monto) => confirmExpense({ catalogo_gasto_id: id, monto })}
                            isConfirming={isConfirming}
                            onUpdateAmount={(recordId, monto) => updateExpense({ id: recordId, monto })}
                            isUpdating={isUpdating}
                        />
                    )}

                    {activeTab === 'VARIABLES' && (
                        <VariableExpensesView 
                            expenses={data?.variableExpenses || []} 
                            categories={data?.categories || []}
                            onCreateVariable={createVariableExpense}
                            isCreating={isCreatingVariable}
                            onDeleteExpense={deleteExpense}
                            isDeleting={isDeleting}
                        />
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}
