export interface ExpenseType {
    id: number;
    nombre: string;
    categoria_gasto: 'FIJO' | 'VARIABLE';
}

export interface CatalogExpense {
    id: number;
    nombre: string;
    monto_base: number | null;
    frecuencia: string | null;
    tipo_gasto_id: number;
    tipos_gasto?: ExpenseType;
}

export interface ExpenseRecord {
    id: number | string;
    fecha: string;
    monto: number;
    descripcion_extra: string | null;
    catalogo_gasto_id: number;
    catalogo_gastos?: CatalogExpense;
}

export interface FixedExpenseWithRecords extends CatalogExpense {
    registro_gastos: ExpenseRecord[];
}

export interface ExpenseSummary {
    fixedConfirmed: number;
    variables: number;
    total: number;
    fixedPendingCount: number;
}

export interface MonthlyExpenseData {
    summary: ExpenseSummary;
    fixedExpenses: FixedExpenseWithRecords[];
    variableExpenses: ExpenseRecord[];
    categories: ExpenseType[];
}
