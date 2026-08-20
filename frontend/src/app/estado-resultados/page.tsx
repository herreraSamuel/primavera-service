"use client";

import EstadoResultados from "@/modules/estado-resultados/components/EstadoResultados";
import RoleGuard from "@/components/shared/RoleGuard";

export default function EstadoResultadosPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <EstadoResultados />
    </RoleGuard>
  );
}
