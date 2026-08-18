"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

interface LoginFormData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (formData: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            const { token, user } = await authService.login(formData);
            authService.setSession(token, user);
            router.push("/clients");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Error al iniciar sesión. Intente nuevamente.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1923] relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/8 to-transparent blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/8 to-transparent blur-3xl" />
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-400/5 to-blue-500/5 blur-2xl" />
            </div>

            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
            }} />

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-10 shadow-2xl shadow-black/40">
                    <div className="flex flex-col items-center mb-10">
                        <div className="relative w-48 h-28 mb-6">
                            <Image
                                src="/Logo 21 años Xela.png"
                                alt="Viajes Primavera Xela"
                                fill
                                priority
                                sizes="192px"
                                className="object-contain drop-shadow-lg"
                            />
                        </div>
                        <h1 className="text-white text-xl font-semibold tracking-tight">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-slate-400 text-sm mt-1.5">
                            Ingrese sus credenciales para continuar
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="login-email"
                                className="text-sm font-medium text-slate-300 block"
                            >
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                    className={`w-full h-11 px-4 rounded-xl bg-white/[0.05] border text-white placeholder:text-slate-500 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 ${
                                        errors.email
                                            ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                                            : "border-white/[0.08] hover:border-white/[0.15]"
                                    }`}
                                    {...register("email", {
                                        required: "El correo es requerido",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Ingrese un correo válido",
                                        },
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-xs mt-1 pl-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="login-password"
                                className="text-sm font-medium text-slate-300 block"
                            >
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.05] border text-white placeholder:text-slate-500 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 ${
                                        errors.password
                                            ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50"
                                            : "border-white/[0.08] hover:border-white/[0.15]"
                                    }`}
                                    {...register("password", {
                                        required: "La contraseña es requerida",
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-xs mt-1 pl-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0F1923] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Iniciar Sesión
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/[0.06]">
                        <p className="text-center text-xs text-slate-500">
                            Sistema de gestión empresarial
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    © {new Date().getFullYear()} Viajes Primavera Xela
                </p>
            </div>
        </div>
    );
}
