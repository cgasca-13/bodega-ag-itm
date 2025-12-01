'use client';

import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import BrandModal from './BrandModal';

interface Brand {
  idMarca: number;
  nombre: string;
  activo: boolean;
}

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const loadBrands = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('/api/auth/catalogues/brand', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBrands(data);
        setFilteredBrands(data);
      }
    } catch {
      // Error handling
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  useEffect(() => {
    const filtered = brands.filter(brand =>
      brand.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrands(filtered);
  }, [searchTerm, brands]);

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar la marca "${brand.nombre}"?`)) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`/api/auth/catalogues/brand/${brand.idMarca}/deactivate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await loadBrands();
        }
      } catch {
        // Error handling
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleSaveBrand = async () => {
    await loadBrands();
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  const columns = [
    {
      name: 'Nombre',
      selector: (row: Brand) => row.nombre,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Brand) => row.activo ? 'Activo' : 'Inactivo',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: Brand) => (
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
          <h2 className='text-2xl font-semibold text-[#525252] mb-4'>Marcas - Resultados [{filteredBrands.length}]</h2>
          <button 
            onClick={handleCreateNew}
            className='bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
          >
            + Nueva Marca
          </button>
        </div>
      <div className='px-2 pb-2'>
        <input 
          className='p-3 w-full md:w-96 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
          type="text" 
          placeholder="Buscar marca por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredBrands}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        progressPending={filteredBrands.length === 0 && brands.length === 0}
        progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
        customStyles={customStyles}
        fixedHeader
        noDataComponent={<div className='p-6 text-gray-500'>No se encontraron marcas</div>}
      />
      </div>

      {isModalOpen && (
        <BrandModal
          brand={selectedBrand}
          onClose={handleCloseModal}
          onSave={handleSaveBrand}
        />
      )}
    </div>
  );
}