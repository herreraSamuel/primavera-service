"use client";

import { authService } from "@/services/auth.service";

interface RoleGuardProps {
    allowedRoles: string[];
    children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    if (!authService.hasRole(allowedRoles)) {
        return null;
    }

    return <>{children}</>;
}
