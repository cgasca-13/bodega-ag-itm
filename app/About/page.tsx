import React from 'react'
import ProtectedRoute from '../Components/ProtectedRoute'
import Navbar from '../Components/Navbar'

const page = () => {
  return (
    <ProtectedRoute>
    <div className="flex h-screen">
    <Navbar direction="Sobre Nosotros">
        <div className="m-12 p-6 rounded-lg shadow-xl bg-white w-auto">
            <div className="flex">
                <h1 className="text-3xl font-bold text-[#525252]">Sobre Nosotros</h1>
            </div>
            <p className="mt-4 text-[#525252] text-xl">
                Bienvenido a la aplicación de gestión de inventarios de la Bodega AG del ITM. Esta plataforma ha sido diseñada para facilitar la administración eficiente de los recursos y productos almacenados en nuestra bodega.
            </p>
            <p className="mt-4 text-[#525252] text-xl">
                Nuestra misión es proporcionar una herramienta intuitiva y robusta que permita a los usuarios gestionar el inventario de manera efectiva, asegurando la disponibilidad de productos y optimizando los procesos logísticos.
            </p>
            <p className="mt-4 text-[#525252] text-xl">
                Equipo de desarrollo:
            </p>
            <ul className="list-disc list-inside mt-2 text-[#525252] text-xl">
                <li>Gasca Contreras Carlos - Desarrollador FrontEnd</li>
                <li>Ramírez Arias Luis Javier - Desarrollador Backend</li>
            </ul>
        </div>
    </Navbar>
    </div>
    </ProtectedRoute>
  )
}

export default page