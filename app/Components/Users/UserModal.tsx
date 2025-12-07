import React from 'react'
import { useRouter } from 'next/navigation'

interface Usuario {
  idUsuario: number;
  usuario: string;
  nombre: string;
  nivel: number;
  activo: boolean;
}

interface UserModalProps {
    usuario: Usuario | null;
    onClose: () => void;
    onSuccess?: () => void;
    currentUsername: string;
}

const UserModal = ({ usuario, onClose, onSuccess, currentUsername }: UserModalProps) => {
    const router = useRouter();
    const isEditing = usuario !== null;
    const [usuarioUsername, setUsuarioUsername] = React.useState(usuario?.usuario || '');
    const [nombre, setNombre] = React.useState(usuario?.nombre || '');
    const [contrasena, setContrasena] = React.useState('');
    const [nivel, setNivel] = React.useState(usuario?.nivel || 2);
    const [activo, setActivo] = React.useState(usuario?.activo ?? true);
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
                // Actualizar usuario existente (PUT)
                const usuarioId = usuario.idUsuario;
                
                if (!usuarioId) {
                    throw new Error('No se encontró el ID del usuario');
                }

                // Preparar body - solo incluir contraseña si se proporcionó
                const body: {
                    usuario: string;
                    nombre: string;
                    nivel: number;
                    activo: boolean;
                    contrasena?: string;
                } = {
                    usuario: usuarioUsername,
                    nombre,
                    nivel,
                    activo
                };

                // Solo incluir contraseña si se proporcionó
                if (contrasena.trim()) {
                    body.contrasena = contrasena;
                }
                
                response = await fetch(`/api/auth/usuarios/${usuarioId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                });
            } else {
                // Crear nuevo usuario (POST) - contraseña es obligatoria
                if (!contrasena.trim()) {
                    setError('La contraseña es obligatoria para crear un nuevo usuario');
                    setIsLoading(false);
                    return;
                }

                response = await fetch('/api/auth/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        usuario: usuarioUsername,
                        nombre,
                        contrasena,
                        nivel
                    })
                });
            }

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error al guardar el usuario');
            }

            // Si el usuario se desactivó a sí mismo, cerrar sesión
            if (isEditing && usuario?.usuario === currentUsername && !activo) {
                // Limpiar sesión
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUserName');
                sessionStorage.removeItem('userLevel');
                
                // Redirigir al login
                router.push('/');
                return;
            }

            // Éxito - cerrar modal y refrescar tabla
            if (onSuccess) onSuccess();
            onClose();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#525252]">
                {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                Usuario
                </label>
                <input
                type="text"
                value={usuarioUsername}
                onChange={(e) => setUsuarioUsername(e.target.value)}
                className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20"
                placeholder="Ingrese el nombre de usuario"
                disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
                </label>
                <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20"
                placeholder="Ingrese el nombre completo"
                disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña {isEditing && <span className="text-gray-500 text-xs">(opcional - dejar vacío para no cambiar)</span>}
                </label>
                <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20"
                placeholder={isEditing ? "Dejar vacío para mantener contraseña actual" : "Ingrese la contraseña"}
                disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nivel de Acceso
                </label>
                <select
                value={nivel}
                onChange={(e) => setNivel(Number(e.target.value))}
                className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 hover:cursor-pointer"
                disabled={isLoading}
                >
                <option value={1}>Total</option>
                <option value={2}>Parcial</option>
                </select>
                {/* Advertencia cuando se modifica el propio nivel */}
                {isEditing && usuario?.usuario === currentUsername && usuario?.nivel !== nivel && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-xs">
                        ⚠️ Está modificando su propio nivel de acceso. Si lo reduce, no podrá revertir este cambio a menos que otro usuario con acceso Total lo haga.
                    </div>
                )}
            </div>

            {isEditing && (
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                </label>
                <select
                    value={activo ? 'true' : 'false'}
                    onChange={(e) => setActivo(e.target.value === 'true')}
                    className="w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 hover:cursor-pointer"
                    disabled={isLoading}
                >
                    <option value="true">Habilitado</option>
                    <option value="false">Deshabilitado</option>
                </select>
                {/* Advertencia cuando se deshabilita el propio usuario */}
                {usuario?.usuario === currentUsername && usuario?.activo && !activo && (
                    <div className="mt-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-xs">
                        ⚠️ Está deshabilitando su propia cuenta. Su sesión se cerrará automáticamente y no podrá iniciar sesión hasta que otro usuario con acceso Total la reactive.
                    </div>
                )}
                </div>
            )}

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
                disabled={isLoading || !usuarioUsername.trim() || !nombre.trim()}
                className="px-4 py-2 bg-[#233876] text-white rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                </button>
            </div>
            </div>
        </div>
        </div>
    )
}

export default UserModal
