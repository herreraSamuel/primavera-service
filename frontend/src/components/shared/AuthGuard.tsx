"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";

const PUBLIC_ROUTES = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const isPublic = PUBLIC_ROUTES.includes(pathname);
        const isAuthenticated = authService.isAuthenticated();

        if (!isAuthenticated && !isPublic) {
            router.replace("/login");
            return;
        }

        if (isAuthenticated && isPublic) {
            router.replace("/clients");
            return;
        }

        setIsReady(true);
    }, [pathname, router]);

    if (!isReady) return null;

    return <>{children}</>;
}
