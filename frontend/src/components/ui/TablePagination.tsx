import React from 'react';
import { 
    ChevronLeft, 
    ChevronRight, 
    ChevronsLeft, 
    ChevronsRight 
} from 'lucide-react';

export interface TablePaginationProps {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

export function TablePagination({
    page,
    limit,
    total,
    totalPages,
    onPageChange,
    onLimitChange
}: TablePaginationProps) {
    const limitOptions = [5, 10, 20, 30, 50];
    
    const effectiveTotalPages = Math.max(1, totalPages || Math.ceil(total / limit) || 1);
    const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
    const endRecord = Math.min(page * limit, total);

    const handleFirst = () => {
        if (page > 1) onPageChange(1);
    };

    const handlePrevious = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < effectiveTotalPages) onPageChange(page + 1);
    };

    const handleLast = () => {
        if (page < effectiveTotalPages) onPageChange(effectiveTotalPages);
    };

    const getPageItems = (): (number | string)[] => {
        if (effectiveTotalPages <= 7) {
            return Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);
        }

        if (page <= 4) {
            return [1, 2, 3, 4, 5, 'ellipsis-right', effectiveTotalPages];
        }

        if (page >= effectiveTotalPages - 3) {
            return [
                1, 
                'ellipsis-left', 
                effectiveTotalPages - 4, 
                effectiveTotalPages - 3, 
                effectiveTotalPages - 2, 
                effectiveTotalPages - 1, 
                effectiveTotalPages
            ];
        }

        return [1, 'ellipsis-left', page - 1, page, page + 1, 'ellipsis-right', effectiveTotalPages];
    };

    const pageItems = getPageItems();

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                    Mostrando <span className="font-semibold text-slate-700">{startRecord.toLocaleString()}</span>
                    {" - "}
                    <span className="font-semibold text-slate-700">{endRecord.toLocaleString()}</span>
                    {" de "}
                    <span className="font-semibold text-slate-700">{total.toLocaleString()}</span>
                    {" registros"}
                </span>

                <div className="h-4 w-px bg-slate-200" />

                <div className="flex items-center gap-2">
                    <span>Filas por página:</span>
                    <select
                        value={limit}
                        onChange={(e) => {
                            onLimitChange(Number(e.target.value));
                        }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 py-1 px-2.5 focus:outline-none focus:ring-2 focus:ring-[#F2B138]/40 focus:border-[#F2B138] cursor-pointer transition-colors"
                    >
                        {limitOptions.map(opt => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={handleFirst}
                    disabled={page <= 1}
                    title="Primera página"
                    aria-label="Primera página"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={page <= 1}
                    title="Página anterior"
                    aria-label="Página anterior"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {pageItems.map((item, index) => {
                    if (typeof item === 'string') {
                        return (
                            <span
                                key={`${item}-${index}`}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 font-medium text-sm select-none"
                            >
                                •••
                            </span>
                        );
                    }

                    const isActive = page === item;

                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPageChange(item)}
                            aria-label={`Página ${item}`}
                            aria-current={isActive ? 'page' : undefined}
                            className={`min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 ${
                                isActive
                                    ? 'bg-[#F2B138] text-white shadow-sm font-bold ring-2 ring-[#F2B138]/30'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={page >= effectiveTotalPages || total === 0}
                    title="Página siguiente"
                    aria-label="Página siguiente"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

                <button
                    type="button"
                    onClick={handleLast}
                    disabled={page >= effectiveTotalPages || total === 0}
                    title="Última página"
                    aria-label="Última página"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
