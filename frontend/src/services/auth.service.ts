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
    };
}

export const authService = {
    login: async (payload: LoginPayload): Promise<AuthUser> => {
        const { data } = await api.post<LoginResponse>("/auth/login", payload);
        return data.data.user;
    },

    logout: async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        } finally {
            localStorage.removeItem("user_data");
        }
    },

    getUser: (): AuthUser | null => {
        if (typeof window === "undefined") return null;
        const user = localStorage.getItem("user_data");
        if (!user || user === "undefined") return null;
        
        try {
            return JSON.parse(user);
        } catch (error) {
            console.error("Error parsing user_data from localStorage:", error);
            return null;
        }
    },

    setSession: (user: AuthUser) => {
        localStorage.setItem("user_data", JSON.stringify(user));
    },

    isAuthenticated: (): boolean => {
        return !!authService.getUser();
    },
};
