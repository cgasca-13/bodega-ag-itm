"use client";

import AreaTable from "../Components/Catalogues/Area/AreaTable";
import BrandTable from "../Components/Catalogues/Brand/BrandTable";
import CategoryTable from "../Components/Catalogues/Category/CategoryTable";
import StateTable from "../Components/Catalogues/Status/StatusTable";
import Navbar from "../Components/Navbar";
import ProtectedRoute from "../Components/ProtectedRoute";
import { useState } from "react";

const Page = () => {
  const [selectedCatalogue, setSelectedCatalogue] = useState("Área");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCatalogue(e.target.value);
  };

  return (
    <ProtectedRoute>
      <Navbar direction="Catálogos">
        <div className="p-4 md:p-8 lg:p-12">
            <div className="flex">
              <h1 className="text-2xl md:text-3xl font-bold text-[#525252]">Catálogos</h1>
            </div>
            <p className="mt-4 text-[#525252] text-base md:text-lg lg:text-xl">Administre los valores de referencia que se usan para clasificar los productos.</p>

          <div className="flex flex-row justify-center md:justify-end mt-4 md:mt-6">
            <select 
              value={selectedCatalogue}
              onChange={handleSelectChange}
              className="bg-white rounded-xl w-full sm:w-64 md:w-56 lg:w-1/6 h-12 md:h-14 text-base md:text-lg 
                      focus:outline-none hover:cursor-pointer transition-all duration-200 
                      pl-4 pr-10 border-2 border-[#C9CBCD]
                      appearance-none
                      bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNiA5TDEyIDE1TDE4IDkiIHN0cm9rZT0iIzIzMzg3NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')]
                      bg-no-repeat
                      bg-position-[right_0.75rem_center]
                      bg-size-[1.5rem]">
              <option value="Área">Área</option>
              <option value="Categoría">Categoría</option>
              <option value="Estado">Estado</option>
              <option value="Marca">Marca</option>
            </select>
          </div>

          <div className="mt-6">
            {selectedCatalogue === "Área" && (
              <AreaTable />
            )}
            {selectedCatalogue === "Marca" && (
              <BrandTable />
            )}
            {selectedCatalogue === "Categoría" && (
              <CategoryTable />
            )}
            {selectedCatalogue === "Estado" && (
              <StateTable />
            )}
            
          </div>
        </div>
      </Navbar>
    </ProtectedRoute>
  )
}

export default Page