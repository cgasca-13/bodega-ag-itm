import InventoryTable from "../Components/Inventory/InventoryTable";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function page() {
  return (
    <ProtectedRoute>
    <div className="flex h-screen">
        <Navbar direction="Inventario">
          <div className="p-12">
            <div className="flex">
              <h1 className="text-3xl font-bold text-[#525252]">Inventario de Productos</h1>
              <button className=" text-lg ml-auto bg-[#233876] text-white px-4 py-4 rounded-lg hover:bg-[#1b2a5f] hover:cursor-pointer transition-colors duration-200">
                + Agregar Producto
              </button>
            </div>
            <p className="mt-4 text-[#525252] text-xl">Aquí puedes gestionar todos los productos del inventario. Añade, edita o ve el historial de cualquier artículo.</p>
          
            <div className="mt-6">
              <InventoryTable />
            </div>
          
          </div>
        </Navbar>
    </div>
    </ProtectedRoute>
  )
}
