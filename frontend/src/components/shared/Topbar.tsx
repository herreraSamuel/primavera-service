"use client";

import { Bell } from "lucide-react";

export default function Topbar() {
    return (
        <header className="h-16 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center text-sm">
                <span className="text-slate-400">Viajes Primavera</span>
                <span className="text-slate-300 mx-2">/</span>
                <span className="text-slate-800 font-medium">Clientes</span>
            </div>
            
            <div className="flex items-center gap-6">
                <button
                    type="button"
                    className="relative text-slate-400 hover:text-slate-800 transition-colors"
                >
                    <Bell className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-[#0367A6] text-white font-bold flex items-center justify-center text-sm shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                    SH
                </div>
            </div>
        </header>
    );
}