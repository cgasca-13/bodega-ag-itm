'use client';
import React from 'react';

interface Movimiento {
  idMovimiento: number;
  fecha: string;
  hora: string;
  accion: string;
  detalles: string;
  tablaAfectada: string;
  idRegistroAfectado: number;
  usuario: {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
}

interface MovementDetailsModalProps {
  movimiento: Movimiento;
  onClose: () => void;
}

const MovementDetailsModal = ({ movimiento, onClose }: MovementDetailsModalProps) => {
  const getAccionColor = (accion: string) => {
    const colors: { [key: string]: string } = {
      'CREAR': 'bg-green-100 text-green-800',
      'MODIFICAR': 'bg-blue-100 text-blue-800',
      'ELIMINAR': 'bg-gray-100 text-gray-800',
      'BAJA': 'bg-red-100 text-red-800',
      'ACTIVAR': 'bg-teal-100 text-teal-800',
      'DESACTIVAR': 'bg-orange-100 text-orange-800',
      'EN USO': 'bg-purple-100 text-purple-800',
    };
    return colors[accion] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-[#525252] mb-6'>
          Detalles del Movimiento
        </h2>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                ID de Movimiento
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {movimiento.idMovimiento}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Fecha
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {movimiento.fecha}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Hora
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {movimiento.hora}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Acción
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl'>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccionColor(movimiento.accion)}`}>
                  {movimiento.accion}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>
              Usuario
            </label>
            <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
              {movimiento.usuario.nombre} {movimiento.usuario.apellido} ({movimiento.usuario.correo})
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>
              Detalles
            </label>
            <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
              {movimiento.detalles}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Tabla Afectada
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {movimiento.tablaAfectada}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                ID del Registro Afectado
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {movimiento.idRegistroAfectado}
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-3 mt-8'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-[#233876] text-white rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementDetailsModal;
