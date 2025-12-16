import React from 'react'
import DataTable from 'react-data-table-component'
import { FaRegEdit } from "react-icons/fa";
import UserModal from './UserModal';

interface Usuario {
  idUsuario: number;
  usuario: string;
  nombre: string;
  nivel: number;
  activo: boolean;
}

const UserTable = () => {

  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = React.useState<Usuario[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUsuario, setSelectedUsuario] = React.useState<Usuario | null>(null);
  const [currentUsername, setCurrentUsername] = React.useState<string>('');
  const [authError, setAuthError] = React.useState(false);

  const loadUsuarios = React.useCallback(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      console.error('No hay token de autenticación');
      return;
    }

    fetch('/api/auth/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (response.status === 403) {
          setAuthError(true);
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.success) {
          setUsuarios(data.usuarios);
          setFilteredUsuarios(data.usuarios);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadUsuarios();
    // Obtener el usuario actual del sessionStorage
    const username = sessionStorage.getItem('currentUser');
    if (username) {
      setCurrentUsername(username);
    }
  }, [loadUsuarios]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);
    
    if (searchTerm === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter((usuario: Usuario) =>
        usuario.usuario.toLowerCase().includes(searchTerm) ||
        usuario.nombre.toLowerCase().includes(searchTerm)
      );
      setFilteredUsuarios(filtered);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const getNivelAccesoText = (nivel: number) => {
    switch (nivel) {
      case 1:
        return 'Total';
      case 2:
        return 'Parcial';
      default:
        return 'Desconocido';
    }
  };

  const columns = [
    {
      name: 'Usuario',
      selector: (row: Usuario) => row.usuario,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: (row: Usuario) => row.nombre,
      sortable: true,
    },
    {
      name: 'Nivel Acceso',
      selector: (row: Usuario) => getNivelAccesoText(row.nivel),
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row: Usuario) => row.activo ? 'Habilitado' : 'Deshabilitado',
      sortable: true,
    },
    {
      name: 'Acciones',
      button: true,
      cell: (row: Usuario) => (
        <button 
          onClick={() => handleEdit(row)} 
          className="text-[#4CAF50] hover:text-green-700 mx-auto"
        >
          <FaRegEdit className='text-xl hover:cursor-pointer'/>
        </button>
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
    {authError ? (
      <div className='p-4 bg-white rounded-lg'>
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='text-6xl mb-4'>🔒</div>
          <h2 className='text-2xl font-bold text-[#525252] mb-2'>Acceso Restringido</h2>
          <p className='text-gray-600 text-center'>No tienes permisos para acceder a este módulo.</p>
          <p className='text-gray-600 text-center mt-2'>Solo usuarios con nivel de acceso <strong>Total</strong> pueden gestionar usuarios.</p>
        </div>
      </div>
    ) : (
    <div className='p-1 bg-white rounded-lg'>

      <div className='flex flex-col sm:flex-row justify-between px-2 sm:px-4 py-2 items-start sm:items-center gap-3'>
        <h2 className='text-xl sm:text-2xl font-semibold text-[#525252]'>Usuarios - Resultados [{filteredUsuarios.length}]</h2>
        <button 
          onClick={handleCreateNew}
          className='w-full sm:w-auto bg-[#233876] text-white px-4 py-2 rounded-lg hover:bg-[#1a2e5b] hover:cursor-pointer transition-all duration-200'
        >
          + Nuevo Usuario
        </button>
      </div>
      <div className='px-2 pb-2'>
        <input 
          className='p-3 w-full md:w-96 text-sm sm:text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
          type="text" 
          placeholder="Buscar usuario por nombre o usuario..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredUsuarios}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por página:',
          rangeSeparatorText: 'de',
        }}
        progressPending={filteredUsuarios.length === 0 && usuarios.length === 0}
        progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
        customStyles={customStyles}
        fixedHeader
        noDataComponent={<div className='p-6 text-gray-500'>No se encontraron usuarios</div>}
      />

    </div>
    )}
    
    {isModalOpen && (
      <UserModal 
        usuario={selectedUsuario} 
        onClose={handleCloseModal}
        onSuccess={loadUsuarios}
        currentUsername={currentUsername}
      />
    )}
    </>
  )
}

export default UserTable
