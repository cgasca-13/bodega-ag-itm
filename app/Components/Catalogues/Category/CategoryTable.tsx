'use client';

import { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import CategoryModal from './CategoryModal';

interface Category {
  idCategoria: number;
  nombre: string;
  activo: boolean;
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('/api/auth/catalogues/category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      }
    } catch {
      // Error handling
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`¿Estás seguro de que quieres desactivar la categoría "${category.nombre}"?`)) {
      try {
        const token = sessionStorage.getItem('authToken');
        const response = await fetch(`/api/auth/catalogues/category/${category.idCategoria}/deactivate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await loadCategories();
        }
      } catch {
        // Error handling
      }
    }
  };

  const handleCreateNew = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async () => {
    await loadCategories();
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const columns = [
    {
      name: 'Nombre',
      selector: (row: Category) => row.nombre,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Category) => row.activo ? 'Activo' : 'Inactivo',
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: (row: Category) => (
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
          <h2 className='text-2xl font-semibold text-[#525252] mb-4'>Categorías - Resultados [{filteredCategories.length}]</h2>
          <button 
            onClick={handleCreateNew}
            className='bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
          >
            + Nueva Categoría
          </button>
        </div>
      <div className='px-2 pb-2'>
        <input 
          className='p-3 w-full md:w-96 text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
          type="text" 
          placeholder="Buscar categoría por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredCategories}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        progressPending={filteredCategories.length === 0 && categories.length === 0}
        progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
        customStyles={customStyles}
        fixedHeader
        noDataComponent={<div className='p-6 text-gray-500'>No se encontraron categorías</div>}
      />
      </div>

      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={handleCloseModal}
          onSave={handleSaveCategory}
        />
      )}
    </div>
  );
}