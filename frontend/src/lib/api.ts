import axios from "axios";

export const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customMessage =
            error.response?.data?.message ||
            error.message ||
            "Ocurrió un error inesperado al conectar con el servidor.";

        return Promise.reject(new Error(customMessage));
    }
);