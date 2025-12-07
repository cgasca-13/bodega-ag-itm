'use client';

import React from 'react';

interface Status {
  idEstado: number;
  nombre: string;
  activo: boolean;
}

interface StatusModalProps {
  status: Status | null;
  onClose: () => void;
  onSave: () => void;
}

export default function StatusModal({ status, onClose, onSave }: StatusModalProps) {
  const isEditing = status !== null;
  const [nombre, setNombre] = React.useState(status?.nombre || '');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      let response;
      
      if (isEditing) {
        const statusId = status.idEstado;
        
        if (!statusId) {
          throw new Error('No se encontró el ID del estado');
        }
        
        response = await fetch(`/api/auth/catalogues/status/${statusId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ nombre })
        });
      } else {
        response = await fetch('/api/auth/catalogues/status/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ nombre })
        });
      }

      if (!response.ok) {
        throw new Error('Error al guardar el estado');
      }

      onSave();
      onClose();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#525252]">
            {isEditing ? 'Editar Estado' : 'Nuevo Estado'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer transition-all duration-200"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20"
              placeholder="Ingrese el nombre del estado"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !nombre.trim()}
              className="px-4 py-2 bg-[#233876] text-white rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
