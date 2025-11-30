import React from 'react'
import DataTable from 'react-data-table-component'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AreaModal from './AreaModal';

const AreaTable = () => {

  const [areas, setAreas] = React.useState([]);
  const [filteredAreas, setFilteredAreas] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState(null);

  React.useEffect(() => {
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
          setFilteredAreas(data.areas); // Inicializar filteredAreas con los datos
          // console.log('Áreas obtenidas:', data.areas);
        } else {
          console.error('Error al obtener las áreas:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error al obtener las áreas', error);
      });

  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);
    
    if (searchTerm === '') {
      setFilteredAreas(areas);
    } else {
      const filtered = areas.filter((area: any) =>
        area.nombre.toLowerCase().includes(searchTerm)
      );
      setFilteredAreas(filtered);
    }
  };

  const handleEdit = (area: any) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleDelete = (area: any) => {
    // Lógica para eliminar el área
    console.log('Desactivar área:', area);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  const columns = [
    {
      name: 'Nombre',
      selector: (row: any) => row.nombre,
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: any) => (
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
      ignoreRowClick: true,
      button: true,
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
      />
    )}
    </>
  )
}

export default AreaTable