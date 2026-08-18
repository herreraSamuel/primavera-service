"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Shield, ChevronDown } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function Topbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentUser = authService.getUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleLogout = () => {
        authService.logout();
        router.replace("/login");
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <header className="h-16 bg-white px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm print:hidden border-b border-slate-100">
            <div className="flex items-center text-sm">
                <span className="text-slate-400">Viajes Primavera</span>
                <span className="text-slate-300 mx-2">/</span>
                <span className="text-slate-800 font-medium">Panel de Control</span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <Bell className="w-5 h-5" />
                </button>

                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 focus:outline-none"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0367A6] to-[#024976] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {getInitials(user?.nombre)}
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0367A6] to-[#024976] text-white font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                                        {getInitials(user?.nombre)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">
                                            {user?.nombre || "Usuario"}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {user?.email || "Sin correo"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/60 w-fit">
                                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                                        {user?.rol || "Usuario"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-2">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                                >
                                    <div className="p-1.5 rounded-lg bg-red-100/60 group-hover:bg-red-100 text-red-600 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    <span>Cerrar Sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}