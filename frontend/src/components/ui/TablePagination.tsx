import React from 'react';

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
    
    const startRecord = total === 0 ? 0 : (page - 1) * limit + 1;
    const endRecord = Math.min(page * limit, total);

    const handlePrevious = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    const getPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <div className="flex items-center text-sm text-slate-500 mb-4 sm:mb-0">
                <span className="mr-4">
                    Mostrando {startRecord}-{endRecord} de {total} registros
                </span>
                <div className="flex items-center gap-2">
                    <span>Filas por página:</span>
                    <select
                        value={limit}
                        onChange={(e) => onLimitChange(Number(e.target.value))}
                        className="border border-slate-200 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-[#F2B138]/50 focus:border-[#F2B138]"
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
                    onClick={handlePrevious}
                    disabled={page === 1}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                {getPages().map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                            page === p 
                                ? 'bg-[#F2B138] text-white shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={handleNext}
                    disabled={page === totalPages || totalPages === 0}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
