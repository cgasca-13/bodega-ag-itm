'use client';
import React from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import InventoryModal from './InventoryModal';
import BajaModal from './BajaModal';
import ViewProductModal from './ViewProductModal';

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

interface Estado {
  idEstado: number;
  nombre: string;
  activo: boolean;
}

const InventoryTable = () => {
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = React.useState<Producto[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [selectedArea, setSelectedArea] = React.useState<string>('');
  const [selectedCategoria, setSelectedCategoria] = React.useState<string>('');
  const [selectedEstado, setSelectedEstado] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBajaModalOpen, setIsBajaModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedProducto, setSelectedProducto] = React.useState<Producto | null>(null);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [categorias, setCategorias] = React.useState<Categoria[]>([]);
  const [estados, setEstados] = React.useState<Estado[]>([]);

  const loadProductos = React.useCallback(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      return;
    }

    fetch('/api/auth/productos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // El backend puede retornar un array directamente o envuelto en success/data
        if (Array.isArray(data)) {
          setProductos(data);
          setFilteredProductos(data);
        } else if (data && data.success) {
          setProductos(data.data);
          setFilteredProductos(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadFilterOptions = React.useCallback(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      return;
    }

    // Cargar áreas
    fetch('/api/auth/catalogues/area', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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

    // Cargar estados
    fetch('/api/auth/catalogues/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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

  React.useEffect(() => {
    loadProductos();
    loadFilterOptions();
  }, [loadProductos, loadFilterOptions]);

  // Filtrar productos cuando cambien los filtros
  React.useEffect(() => {
    let filtered = productos;

    // Filtro de búsqueda por NoSerie o NoInv
    if (searchText) {
      filtered = filtered.filter((producto: Producto) =>
        producto.noSerie?.toLowerCase().includes(searchText.toLowerCase()) ||
        producto.noInv?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por área
    if (selectedArea && selectedArea !== 'Todas') {
      filtered = filtered.filter((producto: Producto) =>
        producto.area.idArea.toString() === selectedArea
      );
    }

    // Filtro por categoría
    if (selectedCategoria && selectedCategoria !== 'Todas') {
      filtered = filtered.filter((producto: Producto) =>
        producto.categoria.idCategoria.toString() === selectedCategoria
      );
    }

    // Filtro por estado
    if (selectedEstado && selectedEstado !== 'Todos') {
      filtered = filtered.filter((producto: Producto) =>
        producto.estado.idEstado.toString() === selectedEstado
      );
    }

    setFilteredProductos(filtered);
  }, [searchText, selectedArea, selectedCategoria, selectedEstado, productos]);

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const handleView = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsViewModalOpen(true);
  };

  const handleBaja = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsBajaModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedProducto(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducto(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProducto(null);
  };

  const handleCloseBajaModal = () => {
    setIsBajaModalOpen(false);
    setSelectedProducto(null);
  };

  const columns = [
    {
      name: 'No Inv.',
      selector: (row: Producto) => row.noInv,
      sortable: true,
      width: '120px',
    },
    {
      name: 'No Serie',
      selector: (row: Producto) => row.noSerie || 'No tiene',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Categoría',
      selector: (row: Producto) => row.categoria.nombre,
      sortable: true,
    },
    {
      name: 'Modelo',
      selector: (row: Producto) => row.modelo || 'No tiene',
      sortable: true,
    },
    {
      name: 'Área',
      selector: (row: Producto) => row.area.nombre,
      sortable: true,
    },
    {
      name: 'Marca',
      selector: (row: Producto) => row.marca.nombre,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Producto) => row.estado.nombre,
      sortable: true,
      cell: (row: Producto) => {
        const estadoColors: { [key: string]: string } = {
          'En Bodega': 'bg-green-100 text-green-800',
          'En Uso': 'bg-blue-100 text-blue-800',
          'Baja': 'bg-red-100 text-red-800',
          'Desconocido': 'bg-gray-100 text-gray-800',
        };
        const colorClass = estadoColors[row.estado.nombre] || estadoColors['Desconocido'];
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            {row.estado.nombre}
          </span>
        );
      },
    },
    {
      name: <div className="w-full flex justify-center">Acciones</div>,
      button: true,
      width: '180px',
      cell: (row: Producto) => (
        <div className="w-full flex justify-center gap-3">
          <button 
            onClick={() => handleView(row)} 
            className="text-blue-500 hover:text-blue-700"
            title="Ver detalles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button 
            onClick={() => handleEdit(row)} 
            className="text-[#4CAF50] hover:text-green-700"
            title="Editar"
          >
            <FaRegEdit className='text-xl hover:cursor-pointer'/>
          </button>
          <button 
            onClick={() => handleBaja(row)} 
            className="text-red-500 hover:text-red-700"
            title="Dar de baja"
          >
            <MdDelete className='text-2xl hover:cursor-pointer'/>
          </button>
        </div>
      ),
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        backgroundColor: '#F4F4F4',
        color: '#525252',
      },
    },
    rows: {
      style: {
        fontSize: '16px',
        minHeight: '56px',
      },
    },
  };

  return (
    <>
      <div className='p-1 bg-white rounded-lg'>
        <div className='flex justify-between px-4 py-2 items-center'>
          <h2 className='text-2xl font-semibold text-[#525252] mb-4'>
            Resultados: [{filteredProductos.length}]
          </h2>
          <button 
            onClick={handleCreateNew}
            className='bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
          >
            + Nuevo Producto
          </button>
        </div>

        {/* Filtros */}
        <div className='px-4 pb-4 grid grid-cols-1 md:grid-cols-4 gap-3'>
          <input 
            className='p-3 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            type="text" 
            placeholder="Buscar por NoSerie/NoInv..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className='p-3 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">Todas</option>
            {areas && areas.map((area) => (
              <option key={area.idArea} value={area.idArea.toString()}>
                {area.nombre}
              </option>
            ))}
          </select>

          <select
            className='p-3 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            value={selectedCategoria}
            onChange={(e) => setSelectedCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias && categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria.toString()}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <select
            className='p-3 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos</option>
            {estados && estados.map((estado) => (
              <option key={estado.idEstado} value={estado.idEstado.toString()}>
                {estado.nombre}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          columns={columns}
          data={filteredProductos}
          pagination
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
          }}
          progressPending={filteredProductos.length === 0 && productos.length === 0}
          progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
          customStyles={customStyles}
          fixedHeader
          noDataComponent={<div className='p-6 text-gray-500'>No se encontraron productos</div>}
        />
      </div>
    
      {isModalOpen && (
        <InventoryModal 
          producto={selectedProducto} 
          onClose={handleCloseModal}
          onSuccess={loadProductos}
        />
      )}

      {isViewModalOpen && selectedProducto && (
        <ViewProductModal
          producto={selectedProducto}
          onClose={handleCloseViewModal}
        />
      )}

      {isBajaModalOpen && selectedProducto && (
        <BajaModal
          producto={selectedProducto}
          onClose={handleCloseBajaModal}
          onSuccess={loadProductos}
        />
      )}
    </>
  );
};

export default InventoryTable;