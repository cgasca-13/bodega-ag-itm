"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaUserCircle } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";
import { IoInformationCircle } from "react-icons/io5";

const Navbar = ({ direction, children }: { direction: string; children?: React.ReactNode }) => {
    const router = useRouter();
    const [getDirection] = useState(direction || "Inventario");
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        return sessionStorage.getItem("currentUser") || "";
    });
    const [currentUserName, setCurrentUserName] = useState(() => {
        return sessionStorage.getItem("currentUserName") || sessionStorage.getItem("currentUser") || "Usuario";
    });
    const [userLevel, setUserLevel] = useState(() => {
        return parseInt(sessionStorage.getItem("userLevel") || "2");
    });
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowLogoutMenu(false);
            }
        };

        if (showLogoutMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLogoutMenu]);

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserName");
        sessionStorage.removeItem("userLevel");
        router.push("/");
    };

  return (
    <>
        {/* Sidebar izquierdo */}
        <div className="w-1/5 min-h-screen bg-[#233876] pt-4 flex flex-col text-white">
            <div className="flex justify-center">
                <Image src="/images/logoNavbar.png" alt="Logo" width={220} height={220} />
            </div>
            
            <div className="mt-14 flex flex-col text-3xl gap-4 px-8">
                <Link href="/Inventory" className={`${getDirection === "Inventario" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <MdInventory className="inline mr-2" />
                    <p>Inventario</p>
                </Link>
                <Link href="/Catalogues" className={`${getDirection === "Catálogos" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <MdCategory className="inline mr-2 text-4xl" />
                    <p>Catálogos</p>
                </Link>
                <Link href="/History" className={`${getDirection === "Historial" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <LuHistory className="inline mr-2 text-4xl" />
                    <p>Historial</p>
                </Link>
                {/* Solo mostrar Usuarios si el nivel de acceso es Total (1) */}
                {userLevel === 1 && (
                    <Link href="/Users" className={`${getDirection === "Usuarios" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                        <HiUsers className="inline mr-2 text-4xl" />
                        <p>Usuarios</p>
                    </Link>
                )}
            </div>

            {/* Botón de información al final */}
            <div className="mt-auto mb-8 px-8">
                <Link href="/About" className={`${getDirection === "Información" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl text-3xl`}>
                    <IoInformationCircle className="inline mr-2 text-4xl" />
                    <p>Información</p>
                </Link>
            </div>
        </div>

        {/* Contenedor derecho con header y contenido */}
        <div className="flex-1 flex flex-col">
            {/* Barra superior */}
            <div className="w-full h-24 bg-[#4F6091] px-6 flex items-center text-white">
                <p className="text-2xl">BODEGA AG / {getDirection}</p>
                <div className="ml-auto relative flex items-center gap-2" ref={menuRef}>
                    <p className="font-semibold">{currentUserName}</p>
                    <FaUserCircle 
                        className="text-6xl hover:cursor-pointer text-white hover:opacity-80 transition-opacity duration-200" 
                        onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                    />
                    
                    {showLogoutMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-4 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:rounded-lg hover:cursor-pointer transition-all duration-200 flex items-center gap-2"
                            >
                                <span className="text-lg">Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Área de contenido */}
            <div className="flex-1 bg-[#EEEEEE]">
                {children}
            </div>
        </div>
    </>
  )
}

export default Navbar