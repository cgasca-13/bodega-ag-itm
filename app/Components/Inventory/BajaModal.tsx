'use client';
import React from 'react';

interface Producto {
  idProducto: number;
  noInv: string;
  noSerie: string;
  modelo: string;
}

interface BajaModalProps {
  producto: Producto;
  onClose: () => void;
  onSuccess?: () => void;
}

const BajaModal = ({ producto, onClose, onSuccess }: BajaModalProps) => {
  const [motivo, setMotivo] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    if (!motivo.trim()) {
      setError('El motivo de la baja es obligatorio');
      setIsLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay token de autenticación');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/auth/productos/${producto.idProducto}/baja`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motivo: motivo.trim() })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Error al dar de baja el producto');
        setIsLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch {
      setError('Error al dar de baja el producto');
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl p-8 max-w-lg w-full'>
        <h2 className='text-2xl font-bold text-[#525252] mb-4'>
          Dar de Baja Producto
        </h2>

        <div className='mb-6'>
          <p className='text-gray-700 mb-2'>
            ¿Está seguro que desea dar de baja el siguiente producto?
          </p>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600'>
              <strong>No. Inventario:</strong> {producto.noInv}
            </p>
            <p className='text-sm text-gray-600'>
              <strong>No. Serie:</strong> {producto.noSerie || 'No tiene'}
            </p>
            <p className='text-sm text-gray-600'>
              <strong>Modelo:</strong> {producto.modelo || 'No tiene'}
            </p>
          </div>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Motivo de la baja *
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 resize-none'
            rows={4}
            placeholder='Ingrese el motivo de la baja...'
          />
        </div>

        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            disabled={isLoading}
            className='px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Procesando...' : 'Dar de Baja'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BajaModal;
