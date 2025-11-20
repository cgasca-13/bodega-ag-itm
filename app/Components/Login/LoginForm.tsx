"use client";

import Link from "next/link";
import { useState } from "react";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        //Lógica de autenticación

        // console.log("Login attempt:", { username, password });
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

            <Link href="/Inventory">
            <button 
                type="submit"
                className="bg-[#233876] hover:bg-[#1b2a5f] text-white p-3 md:p-4 rounded-xl w-full h-12 md:h-14 
                        text-lg md:text-xl font-semibold transition-all duration-300 hover:cursor-pointer 
                        hover:shadow-lg active:scale-[0.98] mt-8"
            >
                Iniciar Sesión
            </button>
            </Link>

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