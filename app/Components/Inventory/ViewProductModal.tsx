'use client';
import React from 'react';
import Image from 'next/image';

interface Producto {
  idProducto: number;
  noInv: string;
  noSerie: string;
  modelo: string;
  foto?: string;
  area: { idArea: number; nombre: string; activo: boolean };
  categoria: { idCategoria: number; nombre: string; activo: boolean };
  marca: { idMarca: number; nombre: string; activo: boolean };
  estado: { idEstado: number; nombre: string; activo: boolean };
}

interface ViewProductModalProps {
  producto: Producto;
  onClose: () => void;
}

const ViewProductModal = ({ producto, onClose }: ViewProductModalProps) => {
  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-[#525252] mb-6'>
          Detalles del Producto
        </h2>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Número de Inventario
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {producto.noInv}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Número de Serie
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {producto.noSerie || 'No tiene'}
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>
              Modelo
            </label>
            <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
              {producto.modelo || 'No tiene'}
            </div>
          </div>

          {producto.foto && (
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Foto
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl'>
                <Image src={producto.foto} alt="Producto" width={448} height={448} className='w-full max-w-md mx-auto rounded-lg shadow-md' />
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Área
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {producto.area.nombre}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Categoría
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {producto.categoria.nombre}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Marca
              </label>
              <div className='w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700'>
                {producto.marca.nombre}
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-1'>
                Estado
              </label>
              <div className='w-full p-3 rounded-xl'>
                <span className={`px-3 py-2 rounded-full text-sm font-medium ${
                  producto.estado.nombre === 'En Bodega' ? 'bg-green-100 text-green-800' :
                  producto.estado.nombre === 'En Uso' ? 'bg-blue-100 text-blue-800' :
                  producto.estado.nombre === 'Baja' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {producto.estado.nombre}
                </span>
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

export default ViewProductModal;
