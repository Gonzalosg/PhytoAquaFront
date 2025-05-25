import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const rol = localStorage.getItem("rol");
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClasses = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <>
      {/* Botón Menú en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 bg-blue-600 text-white px-3 py-2 rounded-full shadow-md md:hidden"
      >
        ☰
      </button>


      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`bg-white w-64 h-full fixed top-0 left-0 z-20 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block p-6`}
      >
        {/* Logo / Título */}
        <div className="text-2xl font-extrabold text-blue-600 mb-6 border-b pb-2">
          Menú
        </div>

        <nav className="flex flex-col space-y-2 text-base">
          {rol === "Administrador" && (
            <>
              <Link to="/dashboard/usuarios" className={linkClasses("/dashboard/usuarios")}>
                👥 Usuarios
              </Link>
              <Link to="/dashboard/obras" className={linkClasses("/dashboard/obras")}>
                🏗️ Obras
              </Link>
               <Link to="/dashboard/inventario" className={linkClasses("/dashboard/iventario")}>
                🏗️ Inventario
              </Link>
              
              <Link to="/dashboard/albaranes" className={linkClasses("/dashboard/albaranes")}>
                📦 Albaranes
              </Link>
              <Link to="/dashboard/incidencias" className={linkClasses("/dashboard/incidencias")}>
                ⚠️ Incidencias
              </Link>
            </>
          )}

          {rol === "Empleado" && (
            <>
              <Link to="/dashboard/obras" className={linkClasses("/dashboard/obras")}>
                🏗️ Mis Obras
              </Link>
              <Link to="/dashboard/albaranes" className={linkClasses("/dashboard/albaranes")}>
                📦 Mis Albaranes
              </Link>
              <Link to="/dashboard/incidencias" className={linkClasses("/dashboard/incidencias")}>
                ⚠️ Incidencias
              </Link>
            </>
          )}

              {rol === "Cliente" && (
            <>
              <Link to="/dashboard/obras" className={linkClasses("/dashboard/obras")}>
                🏗️ Mis Obras
              </Link>
           
              <Link to="/dashboard/incidencias" className={linkClasses("/dashboard/incidencias")}>
                ⚠️ Incidencias
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
