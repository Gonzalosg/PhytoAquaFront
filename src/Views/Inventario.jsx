// src/Views/Inventario.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../img/Logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalMaterial from "../Components/ModalMaterial";

function Inventario() {
  const [materiales, setMateriales] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    descripcion: "",
    cantidadStock: 0,
    fotoUrl: "",
  });
  const [mostrarMovil, setMostrarMovil] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/Materiales/Ausencia/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMateriales(res.data.data);
    } catch (err) {
      toast.error("Error al cargar materiales");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7119/api/Materiales/Material", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Material guardado correctamente");
      setFormData({ id: 0, nombre: "", descripcion: "", cantidadStock: 0, fotoUrl: "" });
      setModalAbierto(false);
      cargarMateriales();
    } catch (err) {
      toast.error("Error al guardar el material");
    }
  };

  const handleEdit = (material, isMobile = false) => {
    setFormData({ ...material });
    if (isMobile) setModalAbierto(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este material?")) return;
    try {
      await axios.delete(`https://localhost:7119/api/Materiales/DeleteMaterial/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Material eliminado");
      cargarMateriales();
    } catch (err) {
      toast.error("Error al eliminar el material");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-100 to-green-300 flex justify-center items-start py-6 px-4 relative">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <img src={Logo} alt="FitoAqua Logo" className="mx-auto w-52 sm:w-64 h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 border-b pb-3">Gestión de Inventario</h1>

          <div className="md:hidden flex flex-col gap-3 border-b pb-4">
            <button
              onClick={() => {
                setFormData({ id: 0, nombre: "", descripcion: "", cantidadStock: 0, fotoUrl: "" });
                setModalAbierto(true);
              }}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-700"
            >
              ➕ Nuevo Material
            </button>
            <button
              onClick={() => setMostrarMovil((prev) => !prev)}
              className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg shadow hover:bg-gray-800"
            >
              📋 {mostrarMovil ? "Ocultar Inventario" : "Ver Inventario"}
            </button>
          </div>

          {/* Escritorio */}
          <div className="hidden md:block space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">Crear / Editar Material</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cantidad en stock</label>
                    <input
                      type="number"
                      name="cantidadStock"
                      value={formData.cantidadStock}
                      onChange={handleChange}
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Guardar Material
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {materiales.map((m) => (
                  <div key={m.id} className="bg-white p-4 rounded shadow border border-gray-100">
                    <h2 className="text-lg font-semibold text-blue-700 mb-1">{m.nombre}</h2>
                    <p className="text-sm text-gray-700">📦 {m.descripcion}</p>
                    <p className="text-sm text-gray-700">📊 Stock: {m.cantidadStock}</p>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
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
          {mostrarMovil && (
            <div className="md:hidden space-y-4 pt-4">
              {materiales.map((m) => (
                <div key={m.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <h2 className="text-lg font-semibold text-blue-700 mb-1">{m.nombre}</h2>
                  <p className="text-sm">📦 {m.descripcion}</p>
                  <p className="text-sm">📊 Stock: {m.cantidadStock}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(m, true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
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

      <ModalMaterial
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Inventario;
