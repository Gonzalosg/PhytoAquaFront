// src/Views/Obras.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AsignarEmpleado from "../Components/AsignarEmpleado";
import ModalCrearObra from "../Components/ModalCrearObra";
import ModalAsignarEmpleado from "../Components/ModalAsignarEmpleado";
import CrearObra from "../Components/CrearObra";
import Logo from "../img/Logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Obras() {
  const [obras, setObras] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [empleadosPorObra, setEmpleadosPorObra] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAsignarAbierto, setModalAsignarAbierto] = useState(false);
  const [mostrarObrasMovil, setMostrarObrasMovil] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    direccion: "",
    clienteId: "",
    clienteNombre: "",
  });
  const [asignacion, setAsignacion] = useState({ usuarioId: "", obraId: "" });

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarObras();
    if (rol === "Administrador") cargarUsuarios();
  }, []);

  const cargarObras = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/Obras/Obra/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setObras(res.data.data);
      cargarEmpleadosPorObra(res.data.data);
    } catch (err) {
      console.error("Error al obtener obras", err);
    }
  };

  const cargarEmpleadosPorObra = async (obras) => {
    const empleadosMap = {};
    for (const obra of obras) {
      try {
        const res = await axios.get(
          `https://localhost:7119/api/UsuarioObra/empleados/obra/${obra.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        empleadosMap[obra.id] = res.data.data.map((e) => e.name);
      } catch (err) {
        console.error(`Error al cargar empleados de la obra ${obra.id}`, err);
      }
    }
    setEmpleadosPorObra(empleadosMap);
  };

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
    if (name === "clienteId") {
      const usuario = usuarios.find((u) => u.id.toString() === value);
      setFormData((prev) => ({
        ...prev,
        clienteId: value,
        clienteNombre: usuario ? usuario.name : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7119/api/Obras/Obra", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ id: 0, nombre: "", direccion: "", clienteId: "", clienteNombre: "" });
      cargarObras();
      setModalAbierto(false);
      toast.success("✅ Obra guardada correctamente");
    } catch (err) {
      console.error("Error al crear o editar obra", err);
      toast.error("❌ Error al guardar la obra");
    }
  };

  const handleAsignar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7119/api/UsuarioObra", asignacion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsignacion({ usuarioId: "", obraId: "" });
      cargarObras();
      setModalAsignarAbierto(false);
      toast.success("✅ Empleado asignado correctamente");
    } catch (err) {
      console.error("Error al asignar usuario a obra", err);
      toast.error("❌ Error al asignar empleado");
    }
  };

  const handleEdit = (obra) => {
    setFormData({
      id: obra.id,
      nombre: obra.nombre,
      direccion: obra.direccion,
      clienteId: obra.clienteId.toString(),
      clienteNombre: obra.clienteNombre,
    });
    setModalAbierto(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar esta obra?");
    if (!confirm) return;
    try {
      await axios.post(
        "https://localhost:7119/api/Obras/Obra",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      cargarObras();
      toast.success("🗑️ Obra eliminada correctamente");
    } catch (err) {
      console.error("Error al eliminar obra", err);
      toast.error("❌ Error al eliminar la obra");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-100 to-green-300 flex justify-center items-start py-6 px-4 relative">
      <div className="w-full max-w-4xl mx-auto">
        <ToastContainer />
        <div className="text-center mb-6">
          <img src={Logo} alt="FitoAqua Logo" className="mx-auto w-52 sm:w-64 h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 border-b pb-3">Gestión de Obras</h1>

          {rol === "Administrador" && (
            <>
              <div className="md:hidden flex flex-col gap-3 border-b pb-4">
                <button
                  onClick={() => {
                    setFormData({ id: 0, nombre: "", direccion: "", clienteId: "", clienteNombre: "" });
                    setModalAbierto(true);
                  }}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">➕</span> Nueva Obra
                </button>
                <button
                  onClick={() => setModalAsignarAbierto(true)}
                  className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">👷</span> Asignar Empleado
                </button>
                <button
                  onClick={() => setMostrarObrasMovil((prev) => !prev)}
                  className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg shadow hover:bg-gray-800 flex items-center justify-center gap-2"
                >
                  <span className="text-lg">📋</span> {mostrarObrasMovil ? "Ocultar Obras" : "Ver Obras"}
                </button>
              </div>

              <div className="hidden md:block space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CrearObra
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    usuarios={usuarios.filter((u) => u.rol === "Cliente")}
                  />
                  <AsignarEmpleado />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {obras.map((obra) => (
                    <div key={obra.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                      <h2 className="text-lg font-semibold text-blue-700 mb-2">{obra.nombre}</h2>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-600">📍 Dirección:</span> {obra.direccion}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-600">👤 Cliente:</span> {obra.clienteNombre}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-600">👷 Empleados:</span>{" "}
                        {empleadosPorObra[obra.id]?.join(", ") || "Sin empleados"}
                      </p>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(obra)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(obra.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {mostrarObrasMovil && (
            <div className="md:hidden space-y-4 pt-4">
              {obras.map((obra) => (
                <div key={obra.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">{obra.nombre}</h2>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-600">📍 Dirección:</span> {obra.direccion}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-600">👤 Cliente:</span> {obra.clienteNombre}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-gray-600">👷 Empleados:</span>{" "}
                    {empleadosPorObra[obra.id]?.join(", ") || "Sin empleados"}
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(obra)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(obra.id)}
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

        <ModalCrearObra
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleChange}
          usuarios={usuarios.filter((u) => u.rol === "Cliente")}
        />

        <ModalAsignarEmpleado
          isOpen={modalAsignarAbierto}
          onClose={() => setModalAsignarAbierto(false)}
          onSubmit={handleAsignar}
          usuarios={usuarios.filter((u) => u.rol === "Empleado")}
          obras={obras}
          selected={asignacion}
          onChange={(e) => setAsignacion({ ...asignacion, [e.target.name]: e.target.value })}
        />
      </div>
    </div>
  );
}

export default Obras;
