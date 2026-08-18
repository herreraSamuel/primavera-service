import { api } from "@/lib/api";

interface LoginPayload {
    email: string;
    password: string;
}

interface AuthUser {
    id: string;
    nombre: string;
    email: string;
    rol: string;
}

interface LoginResponse {
    status: string;
    message: string;
    data: {
        user: AuthUser;
        token: string;
    };
}

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse["data"]> => {
        const { data } = await api.post<LoginResponse>("/auth/login", payload);
        return data.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    getToken: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    },

    getUser: (): AuthUser | null => {
        if (typeof window === "undefined") return null;
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    setSession: (token: string, user: AuthUser) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    },

    isAuthenticated: (): boolean => {
        return !!authService.getToken();
    },
};
