import React from 'react'
import ProtectedRoute from '../Components/ProtectedRoute'
import Navbar from '../Components/Navbar'

const page = () => {
  return (
    <ProtectedRoute>
    <div className="flex h-screen">
      <Navbar direction="Historial">

      </Navbar>
    </div>
    </ProtectedRoute>
  )
}

export default page