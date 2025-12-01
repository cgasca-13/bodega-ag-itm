import React from 'react'
import DataTable from 'react-data-table-component'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AreaModal from './AreaModal';

interface Area {
  idArea: number;
  nombre: string;
  activo: boolean;
}

const AreaTable = () => {

  const [areas, setAreas] = React.useState<Area[]>([]);
  const [filteredAreas, setFilteredAreas] = React.useState<Area[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);

  const loadAreas = React.useCallback(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    fetch('/api/auth/catalogues/area', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAreas(data.areas);
          setFilteredAreas(data.areas);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);
    
    if (searchTerm === '') {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter((area: Area) =>
        area.nombre.toLowerCase().includes(searchTerm)
      );
      setFilteredAreas(filtered);
    }
  };

  const handleEdit = (area: Area) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (area: Area) => {
    if (!confirm(`¿Está seguro de que desea desactivar el área "${area.nombre}"?`)) {
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        return;
      }

      // Obtener el ID del área
      const areaId = area.idArea;
      
      if (!areaId) {
        alert('Error: No se encontró el ID del área');
        return;
      }

      const response = await fetch(`/api/auth/catalogues/area/${areaId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Área desactivada exitosamente');
        loadAreas(); // Recargar la lista
      } else {
        alert('Error al desactivar el área: ' + data.message);
      }
    } catch (error) {
      alert('Error al desactivar el área');
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  const columns = [
    {
      name: 'Nombre',
      selector: (row: Area) => row.nombre,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Area) => row.activo ? 'Activo' : 'Inactivo',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: Area) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleEdit(row)} 
            className="text-[#4CAF50] hover:text-green-700"
          >
            <FaRegEdit className='text-xl hover:cursor-pointer'/>
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-[#F44336] hover:text-red-700 hover:cursor-pointer">
            <MdDelete className='text-xl hover:cursor-pointer'/>
          </button>
        </div>
      ),
    }
  ]

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
        <h2 className='text-2xl font-semibold text-[#525252] mb-4'>Áreas - Resultados [{filteredAreas.length}]</h2>
        <button 
          onClick={handleCreateNew}
          className='bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
        >
          + Nueva Área
        </button>
      </div>
      <div className='px-2 pb-2'>
        <input 
          className='p-3 w-full md:w-96 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
          type="text" 
          placeholder="Buscar área por nombre..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredAreas}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        progressPending={filteredAreas.length === 0 && areas.length === 0}
        progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
        customStyles={customStyles}
        fixedHeader
        noDataComponent={<div className='p-6 text-gray-500'>No se encontraron áreas</div>}
      />

    </div>
    
    {isModalOpen && (
      <AreaModal 
        area={selectedArea} 
        onClose={handleCloseModal}
        onSuccess={loadAreas}
      />
    )}
    </>
  )
}

export default AreaTable