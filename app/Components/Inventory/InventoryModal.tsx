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

interface Area {
  idArea: number;
  nombre: string;
  activo: boolean;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
  activo: boolean;
}

interface Marca {
  idMarca: number;
  nombre: string;
  activo: boolean;
}

interface Estado {
  idEstado: number;
  nombre: string;
  activo: boolean;
}

interface InventoryModalProps {
  producto: Producto | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const InventoryModal = ({ producto, onClose, onSuccess }: InventoryModalProps) => {
  const isEditing = producto !== null;
  const [noInv, setNoInv] = React.useState(producto?.noInv || '');
  const [noSerie, setNoSerie] = React.useState(producto?.noSerie || '');
  const [modelo, setModelo] = React.useState(producto?.modelo || '');
  const [foto, setFoto] = React.useState(producto?.foto || '');
  const [idArea, setIdArea] = React.useState(producto?.area.idArea || 0);
  const [idCategoria, setIdCategoria] = React.useState(producto?.categoria.idCategoria || 0);
  const [idMarca, setIdMarca] = React.useState(producto?.marca.idMarca || 0);
  const [idEstado, setIdEstado] = React.useState(producto?.estado.idEstado || 0);
  const [noTieneSerie, setNoTieneSerie] = React.useState(false);
  const [noTieneModelo, setNoTieneModelo] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [areas, setAreas] = React.useState<Area[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [marcas, setMarcas] = React.useState<Marca[]>([]);
  const [estados, setEstados] = React.useState<Estado[]>([]);

  React.useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) return;

    // Cargar áreas
    fetch('/api/auth/catalogues/area', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.areas) {
          setAreas(data.areas);
        } else if (Array.isArray(data)) {
          setAreas(data);
        }
      })
      .catch(() => {});

    // Cargar categorías
    fetch('/api/auth/catalogues/category', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.categorias) {
          setCategorias(data.categorias);
        } else if (Array.isArray(data)) {
          setCategorias(data);
        }
      })
      .catch(() => {});

    // Cargar marcas
    fetch('/api/auth/catalogues/brand', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.marcas) {
          setMarcas(data.marcas);
        } else if (Array.isArray(data)) {
          setMarcas(data);
        }
      })
      .catch(() => {});

    // Cargar estados
    fetch('/api/auth/catalogues/status', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.estados) {
          setEstados(data.estados);
        } else if (Array.isArray(data)) {
          setEstados(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      // Validar campos obligatorios
      if (!noInv.trim()) {
        setError('El Número de Inventario es obligatorio');
        setIsLoading(false);
        return;
      }

      if (!idArea || !idCategoria || !idMarca || !idEstado) {
        setError('Todos los selectores son obligatorios');
        setIsLoading(false);
        return;
      }

      let response;
      
      if (isEditing) {
        // Para edición, también usar FormData para soportar actualización de imagen
        const formData = new FormData();
        
        // Agregar el archivo si hay uno nuevo seleccionado
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
        
        // Agregar los demás campos
        formData.append('noInv', noInv.trim());
        formData.append('noSerie', noTieneSerie ? '' : noSerie.trim());
        formData.append('modelo', noTieneModelo ? '' : modelo.trim());
        formData.append('idArea', idArea.toString());
        formData.append('idCategoria', idCategoria.toString());
        formData.append('idMarca', idMarca.toString());
        formData.append('idEstado', idEstado.toString());

        // Actualizar producto existente (PUT)
        response = await fetch(`/api/auth/productos/${producto.idProducto}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } else {
        // Para crear nuevo producto, usar FormData para soportar archivos
        const formData = new FormData();
        
        // Agregar el archivo con el nombre 'file' (minúscula)
        if (selectedFile) {
          formData.append('file', selectedFile);
        }
        
        // Agregar los demás campos
        formData.append('noInv', noInv.trim());
        formData.append('noSerie', noTieneSerie ? '' : noSerie.trim());
        formData.append('modelo', noTieneModelo ? '' : modelo.trim());
        formData.append('idArea', idArea.toString());
        formData.append('idCategoria', idCategoria.toString());
        formData.append('idMarca', idMarca.toString());
        formData.append('idEstado', idEstado.toString());

        // Crear nuevo producto (POST) - NO incluir Content-Type, el navegador lo setea automáticamente con el boundary
        response = await fetch('/api/auth/productos/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Error al guardar el producto');
        setIsLoading(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch {
      setError('Error al guardar el producto');
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <h2 className='text-2xl font-bold text-[#525252] mb-6'>
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Número de Inventario *
            </label>
            <input
              type="text"
              value={noInv}
              onChange={(e) => setNoInv(e.target.value)}
              className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
              placeholder='Ingrese el número de inventario'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Número de Serie
            </label>
            <input
              type="text"
              value={noSerie}
              onChange={(e) => setNoSerie(e.target.value)}
              disabled={noTieneSerie}
              className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 disabled:bg-gray-100'
              placeholder='Ingrese el número de serie'
            />
            <div className='mt-2'>
              <label className='flex items-center space-x-2'>
                <input
                  type="checkbox"
                  checked={noTieneSerie}
                  onChange={(e) => {
                    setNoTieneSerie(e.target.checked);
                    if (e.target.checked) setNoSerie('');
                  }}
                  className='w-4 h-4 text-[#233876] rounded focus:ring-[#233876]'
                />
                <span className='text-sm text-gray-700'>No tiene número de serie</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Modelo
            </label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              disabled={noTieneModelo}
              className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 disabled:bg-gray-100'
              placeholder='Ingrese el modelo'
            />
            <div className='mt-2'>
              <label className='flex items-center space-x-2'>
                <input
                  type="checkbox"
                  checked={noTieneModelo}
                  onChange={(e) => {
                    setNoTieneModelo(e.target.checked);
                    if (e.target.checked) setModelo('');
                  }}
                  className='w-4 h-4 text-[#233876] rounded focus:ring-[#233876]'
                />
                <span className='text-sm text-gray-700'>No tiene modelo</span>
              </label>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Foto (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  // Crear preview local
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFoto(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
            />
            {foto && (
              <div className='mt-2'>
                <div className='text-xs text-gray-500 mb-1'>
                  {selectedFile ? `Archivo seleccionado: ${selectedFile.name}` : 'Vista previa'}
                </div>
                <Image src={foto} alt="Preview" width={128} height={128} className='object-cover rounded-lg border-2 border-gray-200' />
              </div>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Área *
              </label>
              <select
                value={idArea}
                onChange={(e) => setIdArea(Number(e.target.value))}
                className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
              >
                <option value="0">Seleccione un área</option>
                {areas && areas.map((area) => (
                  <option key={area.idArea} value={area.idArea}>
                    {area.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Categoría *
              </label>
              <select
                value={idCategoria}
                onChange={(e) => setIdCategoria(Number(e.target.value))}
                className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
              >
                <option value="0">Seleccione una categoría</option>
                {categorias && categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Marca *
              </label>
              <select
                value={idMarca}
                onChange={(e) => setIdMarca(Number(e.target.value))}
                className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
              >
                <option value="0">Seleccione una marca</option>
                {marcas && marcas.map((marca) => (
                  <option key={marca.idMarca} value={marca.idMarca}>
                    {marca.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Estado *
              </label>
              <select
                value={idEstado}
                onChange={(e) => setIdEstado(Number(e.target.value))}
                className='w-full p-3 border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20'
              >
                <option value="0">Seleccione un estado</option>
                {estados && estados.filter((estado) => estado.nombre !== 'Baja').map((estado) => (
                  <option key={estado.idEstado} value={estado.idEstado}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-8'>
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
            className='px-6 py-2 bg-[#233876] text-white rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
