"use client";

import { Bell } from "lucide-react";

export default function Topbar() {
    return (
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-end sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                </button>

                <div className="h-6 w-px bg-slate-200" />

                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-400/30">
                        SH
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-slate-800">
                            Samuel Herrera
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                            Administrador
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}