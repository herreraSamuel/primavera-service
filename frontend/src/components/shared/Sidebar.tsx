"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Compass, CalendarCheck } from "lucide-react";

const navigationItems = [
    { name: "Inicio", href: "/", icon: LayoutDashboard },
    { name: "Clientes", href: "/clients", icon: Users },
    { name: "Paquetes", href: "/packages", icon: Compass },
    { name: "Reservas", href: "/bookings", icon: CalendarCheck },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen border-r border-sidebar-border shadow-lg">
            <div className="p-4 border-b border-sidebar-border/60 flex flex-col items-center justify-center">
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

            <nav className="flex-1 p-4 space-y-1.5">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? "bg-sidebar-accent text-white font-semibold shadow-sm"
                                : "text-slate-400 hover:bg-sidebar-accent/50 hover:text-white"
                                }`}
                        >

                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-secondary rounded-r-full shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                            )}

                            <Icon
                                className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-secondary" : "text-slate-400 group-hover:text-slate-200"
                                    }`}
                            />
                            <span className="truncate">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>


            <div className="p-4 border-t border-sidebar-border/60 text-xs text-slate-500 flex items-center justify-between">
                <span className="font-mono">v1.0.0</span>
                <span className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Viajes Primavera</span>
            </div>
        </aside>
    );
}
