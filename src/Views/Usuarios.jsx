// src/Views/Usuarios.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../img/Logo.png";
import ModalUsuario from "../Components/ModalUsuario";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuariosMovil, setMostrarUsuariosMovil] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    rol: "",
  });

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    if (rol === "Administrador") cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/Usuarios/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data.data);
    } catch (err) {
      console.error("Error al cargar usuarios", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (payload.password?.trim() === "" || payload.password == null) {
        delete payload.password;
      }

      await axios.post("https://localhost:7119/api/Usuarios/save", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        payload.id === 0 ? "Usuario creado correctamente" : "Usuario actualizado"
      );

      setFormData({ id: 0, name: "", email: "", rol: "", password: "" });
      setModalAbierto(false);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario", err);
      toast.error("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setFormData({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      rol: usuario.rol,
      password: "",
    });
    setModalAbierto(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirm) return;
    try {
      await axios.delete(`https://localhost:7119/api/Usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Usuario eliminado correctamente");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario", err);
      toast.error("Error al eliminar usuario");
    }
  };

  if (rol !== "Administrador") return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-100 to-green-300 flex justify-center items-start py-6 px-4 relative">
      <ToastContainer />
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <img src={Logo} alt="FitoAqua Logo" className="mx-auto w-52 sm:w-64 h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 border-b pb-3">
            Gestión de Usuarios
          </h1>

          <div className="md:hidden flex flex-col gap-3 border-b pb-4">
            <button
              onClick={() => {
                setFormData({ id: 0, name: "", email: "", password: "", rol: "" });
                setModalAbierto(true);
              }}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span className="text-lg">➕</span> Nuevo Usuario
            </button>
            <button
              onClick={() => setMostrarUsuariosMovil((prev) => !prev)}
              className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg shadow hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <span className="text-lg">📋</span>{" "}
              {mostrarUsuariosMovil ? "Ocultar Usuarios" : "Ver Usuarios"}
            </button>
          </div>

          {/* Desktop: Formulario + listado */}
          <div className="hidden md:block space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulario */}
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Crear Nuevo Usuario</h2>
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
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={formData.id === 0}
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      required
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Selecciona un rol</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Empleado">Empleado</option>
                      <option value="Cliente">Cliente</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Guardar Usuario
                  </button>
                </form>
              </div>

              {/* Listado de usuarios */}
              <div className="space-y-4">
                {usuarios.map((u) => (
                  <div
                    key={u.id}
                    className="bg-white p-4 rounded shadow border border-gray-100"
                  >
                    <h2 className="text-lg font-semibold text-blue-700 mb-1">{u.name}</h2>
                    <p className="text-sm text-gray-700">📧 {u.email}</p>
                    <p className="text-sm text-gray-700">🧑‍💼 {u.rol}</p>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Móvil */}
          {mostrarUsuariosMovil && (
            <div className="md:hidden space-y-4 pt-4">
              {usuarios.map((u) => (
                <div
                  key={u.id}
                  className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
                >
                  <h2 className="text-lg font-semibold text-blue-700 mb-1">{u.name}</h2>
                  <p className="text-sm">📧 {u.email}</p>
                  <p className="text-sm">🧑‍💼 {u.rol}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ModalUsuario
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
      />
    </div>
  );
}

export default Usuarios;
