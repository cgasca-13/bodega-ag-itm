'use client';

import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import StatusModal from './StatusModal';

interface Status {
  idEstado: number;
  nombre: string;
  activo: boolean;
}

export default function StatusTable() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<Status[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const loadStatuses = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('/api/auth/catalogues/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatuses(data);
        setFilteredStatuses(data);
      }
    } catch {
      // Error handling
    }
  }, []);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  useEffect(() => {
    const filtered = statuses.filter(status =>
      status.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStatuses(filtered);
  }, [searchTerm, statuses]);

  const handleEdit = (status: Status) => {
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const handleDelete = async (status: Status) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar el estado "${status.nombre}"?`)) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`/api/auth/catalogues/status/${status.idEstado}/deactivate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await loadStatuses();
        }
      } catch {
        // Error handling
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedStatus(null);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async () => {
    await loadStatuses();
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
  };

  const columns = [
    {
      name: 'Nombre',
      selector: (row: Status) => row.nombre,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Status) => row.activo ? 'Activo' : 'Inactivo',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: Status) => (
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
    <div>
      <div className="p-1 bg-white rounded-lg">
        <div className='flex justify-between px-4 py-2 items-center'>
          <h2 className='text-2xl font-semibold text-[#525252] mb-4'>Estados - Resultados [{filteredStatuses.length}]</h2>
          <button 
            onClick={handleCreateNew}
            className='bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
          >
            + Nuevo Estado
          </button>
        </div>
      <div className='px-2 pb-2'>
        <input 
          className='p-3 w-full md:w-96 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
          type="text" 
          placeholder="Buscar estado por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredStatuses}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        progressPending={filteredStatuses.length === 0 && statuses.length === 0}
        progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
        customStyles={customStyles}
        fixedHeader
        noDataComponent={<div className='p-6 text-gray-500'>No se encontraron estados</div>}
      />
      </div>

      {isModalOpen && (
        <StatusModal
          status={selectedStatus}
          onClose={handleCloseModal}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
}