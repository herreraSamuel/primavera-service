export interface MetadataFieldConfig {
    key: string;
    label: string;
    type: "text" | "number" | "select";
    options?: { value: string; label: string }[];
    placeholder?: string;
}

export const SERVICE_METADATA_CONFIG: Record<number, MetadataFieldConfig[]> = {
    12: [
        {
            key: "pais_tramite",
            label: "País de trámite",
            type: "select",
            options: [
                { value: "Estados Unidos", label: "Estados Unidos" },
                { value: "México", label: "México" },
                { value: "China", label: "China" },
                { value: "Canadá", label: "Canadá" },
            ],
        },
        {
            key: "tipo_visa",
            label: "Tipo de visa",
            type: "select",
            options: [
                { value: "Primera vez", label: "Primera vez" },
                { value: "Renovación", label: "Renovación" },
            ],
        },
    ],
    13: [
        { key: "nombre_hotel", label: "Nombre del hotel", type: "text", placeholder: "Ej: Marriott, Hilton..." },
        { key: "noches", label: "Noches", type: "number", placeholder: "0" },
    ],
    14: [
        { key: "dias_cobertura", label: "Días de cobertura", type: "number", placeholder: "0" },
    ],
    15: [
        { key: "empresa_rentadora", label: "Empresa rentadora", type: "text", placeholder: "Ej: Hertz, Avis..." },
    ],
    16: [
        { key: "naviera", label: "Naviera", type: "text", placeholder: "Ej: Royal Caribbean, MSC..." },
    ],
    17: [
        { key: "territorio", label: "Territorio / Región", type: "text", placeholder: "Ej: Europa, Medio Oriente, Todo el mundo..." },
    ],
};

export const getMetadataFields = (servicioId: number | null): MetadataFieldConfig[] => {
    if (!servicioId) return [];
    return SERVICE_METADATA_CONFIG[servicioId] || [];
};
