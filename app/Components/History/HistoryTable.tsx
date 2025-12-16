'use client';
import React from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEye, FaFilePdf } from "react-icons/fa";
import MovementDetailsModal from './MovementDetailsModal';

interface Movimiento {
  idMovimiento: number;
  fecha: string;
  hora: string;
  accion: string;
  detalles: string;
  tablaAfectada: string;
  idRegistroAfectado: number;
  usuario: {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
}

const HistoryTable = () => {
  const [movimientos, setMovimientos] = React.useState<Movimiento[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = React.useState<Movimiento[]>([]);
  const [searchFecha, setSearchFecha] = React.useState('');
  const [searchUsuario, setSearchUsuario] = React.useState('');
  const [selectedMovimiento, setSelectedMovimiento] = React.useState<Movimiento | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const loadMovimientos = React.useCallback(() => {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
      return;
    }

    fetch('/api/auth/movimientos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.success && data.data) {
          setMovimientos(data.data);
          setFilteredMovimientos(data.data);
        } else if (Array.isArray(data)) {
          setMovimientos(data);
          setFilteredMovimientos(data);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    loadMovimientos();
  }, [loadMovimientos]);

  // Filtrar movimientos cuando cambien los filtros
  React.useEffect(() => {
    let filtered = movimientos;

    // Filtro por fecha
    if (searchFecha) {
      filtered = filtered.filter((movimiento: Movimiento) =>
        movimiento.fecha.includes(searchFecha)
      );
    }

    // Filtro por usuario
    if (searchUsuario) {
      filtered = filtered.filter((movimiento: Movimiento) => {
        const nombreCompleto = `${movimiento.usuario?.nombre || ''} ${movimiento.usuario?.apellido || ''}`.toLowerCase();
        const correo = movimiento.usuario?.correo?.toLowerCase() || '';
        return nombreCompleto.includes(searchUsuario.toLowerCase()) ||
               correo.includes(searchUsuario.toLowerCase());
      });
    }

    setFilteredMovimientos(filtered);
  }, [searchFecha, searchUsuario, movimientos]);

  const handleViewDetails = (movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovimiento(null);
  };

  const handleGeneratePDF = async () => {
    // Importar dinámicamente jsPDF y jspdf-autotable
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = new jsPDF() as any;

    // Título del documento
    doc.setFontSize(18);
    doc.text('Historial de Movimientos', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-MX')}`, 14, 30);
    doc.text(`Total de registros: ${filteredMovimientos.length}`, 14, 36);

    // Preparar datos para la tabla
    const tableData = filteredMovimientos.map(mov => [
      mov.fecha,
      mov.hora,
      `${mov.usuario?.nombre || ''} ${mov.usuario?.apellido || ''}`.trim(),
      mov.accion,
      mov.detalles
    ]);

    // Generar tabla
    autoTable(doc, {
      startY: 42,
      head: [['Fecha', 'Hora', 'Usuario', 'Acción', 'Detalles']],
      body: tableData,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [35, 56, 118], // Color #233876
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Fecha
        1: { cellWidth: 20 }, // Hora
        2: { cellWidth: 35 }, // Usuario
        3: { cellWidth: 25 }, // Acción
        4: { cellWidth: 'auto' }, // Detalles
      },
      margin: { top: 42 },
    });

    // Guardar el PDF
    doc.save(`historial-movimientos-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getAccionColor = (accion: string) => {
    const colors: { [key: string]: string } = {
      'INSERT': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'ELIMINAR': 'bg-gray-100 text-gray-800',
      'BAJA': 'bg-red-100 text-red-800',
      'ACTIVAR': 'bg-teal-100 text-teal-800',
      'DESACTIVAR': 'bg-orange-100 text-orange-800',
      'EN USO': 'bg-purple-100 text-purple-800',
    };
    return colors[accion] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    {
      name: 'Fecha',
      selector: (row: Movimiento) => row.fecha,
      sortable: true,
    //   width: '120px',
    },
    {
      name: 'Hora',
      selector: (row: Movimiento) => row.hora,
      sortable: true,
    //   width: '90px',
    },
    {
      name: 'Usuario',
      selector: (row: Movimiento) => `${row.usuario.nombre} ${row.usuario.apellido}`,
      sortable: true,
    //   width: '180px',
    },
    {
      name: 'Acción',
      selector: (row: Movimiento) => row.accion,
      sortable: true,
      width: '140px',
      center: true,
      cell: (row: Movimiento) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccionColor(row.accion)}`}>
          {row.accion}
        </span>
      ),
    },
    {
      name: 'Detalles',
      selector: (row: Movimiento) => row.detalles,
      sortable: false,
      width: '300px',
      cell: (row: Movimiento) => (
        <span title={row.detalles}>
          {row.detalles.length > 30 ? `${row.detalles.substring(0, 30)}...` : row.detalles}
        </span>
      ),
    },
    {
      name: <div className="w-full flex justify-center">Acciones</div>,
      button: true,
    //   width: '100px',
      cell: (row: Movimiento) => (
        <div className="w-full flex justify-center">
          <button 
            onClick={() => handleViewDetails(row)} 
            className="text-blue-500 hover:text-blue-700"
            title="Ver detalles completos"
          >
            <FaRegEye className='text-xl hover:cursor-pointer'/>
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
      <div className='p-1 mx-2 sm:mx-8 lg:mx-16 bg-white rounded-lg'>
        <div className='flex flex-col sm:flex-row justify-between px-2 sm:px-4 py-2 items-start sm:items-center gap-3'>
          <h2 className='text-xl sm:text-2xl font-semibold text-[#525252]'>
            Resultados: [{filteredMovimientos.length}]
          </h2>
          <button 
            onClick={handleGeneratePDF}
            className='w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:cursor-pointer transition-all duration-200 flex items-center justify-center gap-2'
          >
            <FaFilePdf className='text-xl' />
            Generar PDF
          </button>
        </div>

        {/* Filtros */}
        <div className='px-2 sm:px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3'>
          <input 
            className='p-3 text-sm sm:text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            type="date" 
            placeholder="Filtrar por fecha..."
            value={searchFecha}
            onChange={(e) => setSearchFecha(e.target.value)}
          />
          
          <input 
            className='p-3 text-sm sm:text-base border-2 border-[#C9CBCD] rounded-xl focus:outline-none focus:border-[#233876] focus:ring-2 focus:ring-[#233876]/20 transition-all duration-200'
            type="text" 
            placeholder="Buscar por usuario..."
            value={searchUsuario}
            onChange={(e) => setSearchUsuario(e.target.value)}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredMovimientos}
          pagination
          paginationComponentOptions={{
            rowsPerPageText: 'Filas por página:',
            rangeSeparatorText: 'de',
          }}
          progressPending={filteredMovimientos.length === 0 && movimientos.length === 0}
          progressComponent={<div className='p-6 text-gray-500'>Cargando...</div>}
          customStyles={customStyles}
          fixedHeader
          noDataComponent={
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='text-6xl mb-4'>📋</div>
              <h3 className='text-xl font-semibold text-[#525252] mb-2'>
                No hay movimientos registrados
              </h3>
              <p className='text-gray-600 text-center'>
                {searchFecha || searchUsuario 
                  ? 'No se encontraron movimientos con los filtros aplicados.' 
                  : 'Aún no se han registrado movimientos de auditoría en el sistema.'}
              </p>
            </div>
          }
        />
      </div>
    
      {isModalOpen && selectedMovimiento && (
        <MovementDetailsModal 
          movimiento={selectedMovimiento} 
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default HistoryTable;
