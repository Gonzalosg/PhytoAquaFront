// src/Components/Sidebar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const rol = localStorage.getItem("rol");
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Botón Menú en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-2 left-2 z-30 bg-blue-600 text-white px-3 py-1 rounded shadow-md md:hidden"
      >
        Menú
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`bg-white w-64 p-6 shadow-md h-full fixed top-0 left-0 z-20 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
       <h2 className="text-xl font-bold text-blue-600 mt-8 mb-8">FitoAqua</h2>

        <nav className="space-y-4">
          {rol === "Administrador" && (
            <>
              <Link to="/dashboard/obras" className="block text-gray-700 hover:text-blue-600">Obras</Link>
              <Link to="/dashboard/albaranes" className="block text-gray-700 hover:text-blue-600">Albaranes</Link>
              <Link to="/dashboard/incidencias" className="block text-gray-700 hover:text-blue-600">Incidencias</Link>
            </>
          )}

          {rol === "Empleado" && (
            <>
              <Link to="/dashboard/obras" className="block text-gray-700 hover:text-blue-600">Mis Obras</Link>
              <Link to="/dashboard/albaranes" className="block text-gray-700 hover:text-blue-600">Mis Albaranes</Link>
              <Link to="/dashboard/incidencias" className="block text-gray-700 hover:text-blue-600">Incidencias</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;