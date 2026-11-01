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
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const responseData = error.response?.data;
        const status = error.response?.status;

        let customMessage: string =
            (typeof responseData?.message === "string" && responseData.message) ||
            (typeof responseData?.error === "string" && responseData.error) ||
            "";

        if (!customMessage || customMessage.startsWith("Request failed with status code")) {
            customMessage = status === 409
                ? "Ya existe un registro con estos datos en el sistema."
                : "Ocurrió un error al procesar la solicitud.";
        }

        const fieldErrors: ApiFieldError[] | undefined = Array.isArray(responseData?.errors)
            ? responseData.errors
            : undefined;

        if (status === 401 && typeof window !== "undefined") {
            const isLoginRequest = error.config?.url?.includes("/auth/login");
            if (!isLoginRequest) {
                localStorage.removeItem("user_data");
                window.location.href = "/login";
            }
        }

        return Promise.reject(new ApiError(customMessage, fieldErrors, status));
    }
);