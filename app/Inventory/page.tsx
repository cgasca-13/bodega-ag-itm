import InventoryTable from "../Components/Inventory/InventoryTable";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";

export default function page() {
  return (
    <ProtectedRoute>
      <Navbar direction="Inventario">
        <div className="p-4 md:p-8 lg:p-12">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-[#525252]">Inventario de Productos</h1>
              <p className="mt-4 text-[#525252] text-base md:text-xl">Aquí puedes gestionar todos los productos del inventario. Añade, edita o ve la información de cualquier artículo.</p>
            </div>
          
            <div className="mt-6">
              <InventoryTable />
            </div>
        </div>
      </Navbar>
    </ProtectedRoute>
  )
}
