"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Banknote, BarChart3, Receipt, FileText } from "lucide-react";
import { authService } from "@/services/auth.service";

const navigationItems = [
    { name: "Inicio", href: "/", icon: LayoutDashboard },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Ventas", href: "/ventas", icon: Banknote },
    { name: "Ganancias", href: "/ganancias", icon: BarChart3 },
    { name: "Gastos", href: "/gastos", icon: Receipt },
    { name: "Edo. Resultados", href: "/estado-resultados", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ nombre: string; email: string; rol: string } | null>(null);

    useEffect(() => {
        setUser(authService.getUser());
    }, []);

    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen border-r border-sidebar-border shadow-lg print:hidden">
            <div className="p-4 border-b border-sidebar-border/60 flex flex-col items-center justify-center shrink-0">
                <div className="relative w-full h-32">
                    <Image
                        src="/Logo 21 años Xela.png"
                        alt="Viajes Primavera Xela"
                        fill
                        priority
                        sizes="(max-width: 256px) 100vw, 256px"
                        className="object-contain scale-110"
                    />
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                                    : "text-slate-400 hover:bg-sidebar-accent/10 hover:text-slate-200"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                                    isActive
                                        ? "text-sidebar-accent-foreground"
                                        : "text-slate-400 group-hover:text-slate-200"
                                }`}
                            />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-sidebar-border/60 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0367A6] text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {getInitials(user?.nombre)}
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-semibold text-white truncate">
                            {user?.nombre || "Usuario"}
                        </span>
                        <span className="text-xs text-slate-400 truncate uppercase tracking-wider">
                            {user?.rol || "Usuario"}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
