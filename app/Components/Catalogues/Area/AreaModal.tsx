import React from 'react'

interface AreaModalProps {
    area: any;
    onClose: () => void;
}

const AreaModal = ({ area, onClose }: AreaModalProps) => {
    const isEditing = area !== null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#525252]">
                {isEditing ? 'Editar Área' : 'Nueva Área'}
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
                defaultValue={area?.nombre || ''}
                className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20"
                />
            </div>

            {/* Muestra todos los campos del objeto área */}
            {/* <div className="text-sm text-gray-600">
                <p className="font-semibold mb-2">Datos completos del área:</p>
                <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-40">
                {JSON.stringify(area, null, 2)}
                </pre>
            </div> */}

            <div className="flex gap-3 justify-end mt-6">
                <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 hover:cursor-pointer transition-all duration-200"
                >
                Cancelar
                </button>
                <button
                className="px-4 py-2 bg-[#233876] text-white rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200"
                >
                {isEditing ? 'Actualizar' : 'Crear'}
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default AreaModal