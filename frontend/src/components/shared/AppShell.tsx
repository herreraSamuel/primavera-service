"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
import AuthGuard from "@/components/shared/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return (
            <AuthGuard>
                <div className="flex-1 min-h-screen">
                    {children}
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 print:block print:w-full">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto print:block print:w-full">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
