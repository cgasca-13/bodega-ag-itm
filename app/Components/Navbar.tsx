"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const Navbar = ({ direction, children }: { direction: string; children?: React.ReactNode }) => {

    const [getDirection] = useState(direction || "Inventario");

  return (
    <>
        {/* Sidebar izquierdo */}
        <div className="w-1/5 min-h-screen bg-[#233876] pt-4 flex flex-col text-white">
            <div className="flex justify-center">
                <Image src="/images/logoNavbar.png" alt="Logo" width={220} height={220} />
            </div>
            
            <div className="mt-14 flex flex-col text-3xl gap-4 px-8">
                <Link href="/Inventory" className={`${getDirection === "Inventario" ? "bg-[#4F6091]" : ""} hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <p>Inventario</p>
                </Link>
                <Link href="/Catalogues" className={`${getDirection === "Catálogos" ? "bg-[#4F6091]" : ""} hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <p>Catálogos</p>
                </Link>
                <Link href="/History" className={`${getDirection === "Historial" ? "bg-[#4F6091]" : ""} hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <p>Historial</p>
                </Link>
                <Link href="/Users" className={`${getDirection === "Usuarios" ? "bg-[#4F6091]" : ""} hover:bg-[#4F6091] transition-colors duration-200 p-3 rounded-xl`}>
                    <p>Usuarios</p>
                </Link>
            </div>
        </div>

        {/* Contenedor derecho con header y contenido */}
        <div className="flex-1 flex flex-col">
            {/* Barra superior */}
            <div className="w-full h-24 bg-[#4F6091] px-6 flex items-center text-white">
                <p className="text-2xl">BODEGA AG / {getDirection}</p>
            </div>
            
            {/* Área de contenido */}
            <div className="flex-1 bg-gray-50">
                {children}
            </div>
        </div>
    </>
  )
}

export default Navbar