// src/Components/Header.jsx
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Header() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: usuario?.id || 0,
    name: usuario?.name || "",
    email: usuario?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        rol: usuario.rol,
      };

      if (formData.password?.trim()) {
        payload.password = formData.password;
      }

      const res = await axios.post("https://localhost:7119/api/Usuarios/save", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Tus datos han sido actualizados");
      setModalAbierto(false);
      localStorage.setItem("usuario", JSON.stringify(res.data.data));
    } catch (err) {
      console.error("Error al actualizar datos", err);
      toast.error("Error al actualizar tus datos");
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const iniciales = usuario?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="absolute top-2 right-2 md:top-4 md:right-6 flex items-center gap-2 md:gap-3 z-50">
        {/* Texto Bienvenida (visible también en móvil) */}
        <div className="text-right text-sm md:text-base">
          <p className="text-gray-700 font-semibold leading-tight">Bienvenido,</p>
          <p className="text-blue-700 font-bold leading-tight truncate max-w-[120px] sm:max-w-xs">{usuario?.name}</p>
        </div>

        {/* Círculo con iniciales */}
        <button
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-blue-700"
        >
          {iniciales}
        </button>
      </div>

      {/* Modal editar usuario */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Editar tus datos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nueva Contraseña (opcional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="••••••"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={cerrarSesion}
                 className="text-red-700 font-semibold hover:underline text-base flex items-center gap-1"
                >
                  Cerrar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default Header;
