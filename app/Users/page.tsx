"use client";

import React from 'react'
import ProtectedRoute from '../Components/ProtectedRoute'
import Navbar from '../Components/Navbar'
import UserTable from '../Components/Users/UserTable'

const Page = () => {
  return (
    <ProtectedRoute>
      <Navbar direction="Usuarios">
        <div className="p-4 md:p-8 lg:p-12">
          <div className="flex">
            <h1 className="text-2xl md:text-3xl font-bold text-[#525252]">Usuarios</h1>
          </div>
          <p className="mt-4 text-[#525252] text-base md:text-xl">Administre los usuarios del sistema y sus niveles de acceso.</p>

          <div className="px-2 sm:px-8 md:px-20 lg:px-40 mt-6">
            <UserTable />
          </div>
        </div>
      </Navbar>
    </ProtectedRoute>
  )
}

export default Page