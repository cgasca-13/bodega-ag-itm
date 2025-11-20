"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const Navbar = ({ direction }: { direction: string }) => {

    const [getDirection] = useState(direction || "Inventario");

  return (
    <div className="flex text-white">
        <div className="w-1/5 min-h-screen justify-center items-start bg-[#233876] pt-4">
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

        <div className="w-full h-24 bg-[#4F6091] px-6 flex items-center">
            <p className="text-2xl">BODEGA AG / {getDirection}</p>
        </div>
    </div>
  )
}

export default Navbar