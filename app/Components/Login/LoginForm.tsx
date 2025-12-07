"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        
        // console.log({ usuario: username, contrasena: password });
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario: username, contrasena: password })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error de autenticación');
            }

            // Guardar token en sessionStorage
            sessionStorage.setItem("authToken", data.token);
            sessionStorage.setItem("currentUser", username);
            sessionStorage.setItem("currentUserName", data.user?.nombre || username);
            sessionStorage.setItem("userLevel", data.user?.nivel?.toString() || "2");
            
            // Redirigir al inventario
            router.push("/Inventory");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-full px-4">
        <div className="w-full max-w-md">

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
                <label 
                htmlFor="username" 
                className="text-lg md:text-xl font-semibold text-gray-700 mb-2"
                >
                Usuario
                </label>
                <input id="username" type="text" placeholder="Nombre de Usuario" value={username} required
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-[#C9CBCD] p-3 md:p-4 rounded-xl w-full h-12 md:h-14 text-base md:text-lg 
                            focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 
                            transition-all duration-200"/>
            </div>

            <div className="flex flex-col">
                <label 
                htmlFor="password" 
                className="text-lg md:text-xl font-semibold text-gray-700 mb-2"
                >
                Contraseña
                </label>
                <input id="password" type="password" placeholder="Contraseña" value={password} required
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-[#C9CBCD] p-3 md:p-4 rounded-xl w-full h-12 md:h-14 text-base md:text-lg 
                            focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 
                            transition-all duration-200"/>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <button 
                type="submit"
                disabled={isLoading}
                className="bg-[#233876] hover:bg-[#1b2a5f] text-white p-3 md:p-4 rounded-xl w-full h-12 md:h-14 
                        text-lg md:text-xl font-semibold transition-all duration-300 hover:cursor-pointer 
                        hover:shadow-lg active:scale-[0.98] mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            </form>

            <div className="mt-2 text-center px-6">
            <p className="text-sm md:text-base text-[#233876] hover:underline transition-all duration-200">
                ¿Olvidaste tu contraseña? Solicita al jefe de departamento que la restablezca.
            </p>
            </div>
        </div>
        </div>
    );
};

export default LoginForm;