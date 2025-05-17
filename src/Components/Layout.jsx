import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 grid grid-cols-1 md:grid-cols-[auto_1fr_auto]">
      
      {/* Contenedor superior solo visible en móvil para alinear menú y bienvenida */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <Sidebar />
        <Header />
      </div>

      {/* Sidebar persistente solo en escritorio */}
      <div className="hidden md:block md:col-start-1 md:row-start-1">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="relative px-4 pt-4 md:pt-20 md:px-8 md:col-start-2 md:row-start-1">
        <Outlet />
      </div>

      {/* Header solo en escritorio */}
      <div className="hidden md:flex md:justify-end md:items-start md:col-start-3 md:row-start-1 px-4">
        <Header />
      </div>
    </div>
  );
}

export default Layout;
