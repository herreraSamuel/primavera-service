import React from "react";
import { TablePagination } from "@/components/ui/TablePagination";

export interface Column<T> {
    key: string;
    header: string;
    className?: string;
    headerClassName?: string;
    render: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    isError?: boolean;
    errorMessage?: string;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    filtersSlot?: React.ReactNode;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        onLimitChange: (limit: number) => void;
    };
}

export function DataTable<T extends { id: string | number | bigint }>({
    data,
    columns,
    isLoading,
    isError,
    errorMessage = "Error al cargar los datos. ¿Está encendido el servidor backend?",
    emptyMessage = "No hay registros.",
    onRowClick,
    filtersSlot,
    pagination,
}: DataTableProps<T>) {
    if (isError) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm mt-6">
                {errorMessage}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-6">
                <div className="p-8 text-center text-slate-500 animate-pulse">
                    Cargando datos...
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mt-6">
            {filtersSlot && (
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        {filtersSlot}
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold bg-white border-b border-slate-100">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 font-semibold ${col.headerClassName || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr
                                    key={String(item.id)}
                                    onClick={() => onRowClick?.(item)}
                                    className={`hover:bg-slate-50/50 transition-colors group ${onRowClick ? "cursor-pointer" : ""}`}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`px-6 py-5 ${col.className || ""}`}
                                        >
                                            {col.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <TablePagination
                    page={pagination.page}
                    limit={pagination.limit}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={pagination.onPageChange}
                    onLimitChange={pagination.onLimitChange}
                />
            )}
        </div>
    );
}
