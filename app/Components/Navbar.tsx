"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { MdCategory } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { HiUsers } from "react-icons/hi";
import { IoInformationCircle } from "react-icons/io5";

const Navbar = ({ direction, children }: { direction: string; children?: React.ReactNode }) => {
    const router = useRouter();
    const [getDirection] = useState(direction || "Inventario");
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        sessionStorage.removeItem("currentUserId");
        sessionStorage.removeItem("currentUserName");
        sessionStorage.removeItem("userLevel");
        router.push("/");
    };

  return (
    <>
        {/* Sidebar izquierdo - Fixed - Oculto en móviles */}
        <div className={`fixed left-0 top-0 w-64 lg:w-1/5 h-screen bg-[#233876] pt-4 flex flex-col text-white z-50 transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex justify-between items-center px-4 lg:px-0">
                <div className="flex justify-center flex-1">
                    <Image src="/images/logoNavbar.png" alt="Logo" width={180} height={180} className="lg:w-[220px] lg:h-auto" />
                </div>
                <button 
                    onClick={() => setShowMobileMenu(false)}
                    className="lg:hidden text-white text-3xl p-2"
                >
                    <FaTimes />
                </button>
            </div>
            
            <div className="mt-8 lg:mt-14 flex flex-col text-2xl lg:text-3xl gap-4 px-6 lg:px-8">
                <Link href="/Inventory" onClick={() => setShowMobileMenu(false)} className={`${getDirection === "Inventario" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <MdInventory className="inline mr-2" />
                    <p>Inventario</p>
                </Link>
                <Link href="/Catalogues" onClick={() => setShowMobileMenu(false)} className={`${getDirection === "Catálogos" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <MdCategory className="inline mr-2 text-3xl lg:text-4xl" />
                    <p>Catálogos</p>
                </Link>
                <Link href="/History" onClick={() => setShowMobileMenu(false)} className={`${getDirection === "Historial" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <LuHistory className="inline mr-2 text-3xl lg:text-4xl" />
                    <p>Historial</p>
                </Link>
                {/* Solo mostrar Usuarios si el nivel de acceso es Total (1) */}
                {userLevel === 1 && (
                    <Link href="/Users" onClick={() => setShowMobileMenu(false)} className={`${getDirection === "Usuarios" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                        <HiUsers className="inline mr-2 text-3xl lg:text-4xl" />
                        <p>Usuarios</p>
                    </Link>
                )}
            </div>

            {/* Botón de información al final */}
            <div className="mt-auto mb-8 px-6 lg:px-8">
                <Link href="/About" onClick={() => setShowMobileMenu(false)} className={`${getDirection === "Información" ? "bg-[#4F6091]" : ""} flex items-center hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl text-2xl lg:text-3xl`}>
                    <IoInformationCircle className="inline mr-2 text-3xl lg:text-4xl" />
                    <p>Información</p>
                </Link>
            </div>
        </div>

        {/* Overlay para móviles */}
        {showMobileMenu && (
            <div 
                className="fixed inset-0 backdrop-blur-sm bg-black/30 z-40 lg:hidden"
                onClick={() => setShowMobileMenu(false)}
            />
        )}

        {/* Contenedor derecho con header y contenido */}
        <div className="lg:ml-[20%] flex flex-col min-h-screen">
            {/* Barra superior - Sticky */}
            <div className="sticky top-0 w-full h-16 lg:h-24 bg-[#4F6091] px-4 lg:px-6 flex items-center text-white z-30">
                <button 
                    onClick={() => setShowMobileMenu(true)}
                    className="lg:hidden text-white text-2xl mr-4"
                >
                    <FaBars />
                </button>
                <p className="text-lg lg:text-2xl truncate">BODEGA AG / {getDirection}</p>
                <div className="ml-auto relative flex items-center gap-2" ref={menuRef}>
                    <p className="font-semibold hidden sm:block text-sm lg:text-base">{currentUserName}</p>
                    <FaUserCircle 
                        className="text-4xl lg:text-6xl hover:cursor-pointer text-white hover:opacity-80 transition-opacity duration-200" 
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
            
            {/* Área de contenido scrolleable */}
            <div className="flex-1 bg-[#EEEEEE] overflow-y-auto">
                {children}
            </div>
        </div>
    </>
  )
}

export default Navbar