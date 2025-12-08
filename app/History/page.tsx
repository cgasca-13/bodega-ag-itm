import React from 'react'
import ProtectedRoute from '../Components/ProtectedRoute'
import Navbar from '../Components/Navbar'
import HistoryTable from '../Components/History/HistoryTable'

const page = () => {
  return (
    <ProtectedRoute>
      <Navbar direction="Historial">
        <div className="p-12">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-[#525252]">Historial de Movimientos</h1>
            <p className="mt-4 text-[#525252] text-xl">
              Vea un historial de auditoría de todos los movimientos (entradas, salidas, asignaciones) que han ocurrido.
            </p>
          </div>
        
          <div className="mt-6">
            <HistoryTable />
          </div>
        </div>
      </Navbar>
    </ProtectedRoute>
  )
}

export default page