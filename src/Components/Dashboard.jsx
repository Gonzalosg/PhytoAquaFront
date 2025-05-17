// src/Views/Dashboard.jsx
import Logo from "../img/Logo.png";
import Piscina from "../img/Piscina.png";

function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-100 to-green-300 flex justify-center items-start py-1 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-2">
          <img src={Logo} alt="FitoAqua Logo" className="mx-auto w-44 h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 border-b pb-2 mb-2">
            Bienvenido, {usuario?.name || "Usuario"}
          </h1>

          <p className="text-gray-700 font-medium">
            Usa el menú lateral para acceder a la gestión de la aplicación.
          </p>

          <div className="text-center mt-4">
            <img
              src="/src/img/Piscina.png"
              alt="Decorativo"
              className="rounded-xl shadow w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
