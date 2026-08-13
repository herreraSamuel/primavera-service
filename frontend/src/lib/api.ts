import axios from "axios";

export interface ApiFieldError {
    field: string;
    message: string;
}

export class ApiError extends Error {
    errors?: ApiFieldError[];
    status?: number;

    constructor(message: string, errors?: ApiFieldError[], status?: number) {
        super(message);
        this.name = "ApiError";
        this.errors = errors;
        this.status = status;
    }
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const responseData = error.response?.data;

        let customMessage =
            responseData?.message ||
            error.message ||
            "Ocurrió un error inesperado al conectar con el servidor.";

        let fieldErrors: ApiFieldError[] | undefined = undefined;

        if (Array.isArray(responseData?.errors)) {
            fieldErrors = responseData.errors;

            const errorDetails = responseData.errors
                .map((err: Record<string, unknown> | string) =>
                    typeof err === "string"
                        ? err
                        : typeof err === "object" && err !== null && "field" in err && "message" in err
                        ? `${err.field}: ${err.message}`
                        : typeof err === "object" && err !== null && "message" in err
                        ? String(err.message)
                        : "Unknown error"
                )
                .filter(Boolean);

            if (errorDetails.length > 0) {
                customMessage = `${responseData.message || "Error de validación"}: ${errorDetails.join(
                    "; "
                )}`;
            }
        }

        return Promise.reject(new ApiError(customMessage, fieldErrors, error.response?.status));
    }
);