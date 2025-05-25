import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../img/Logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalIncidencia from "../Components/ModalIncidencia";

function Incidencias() {
  const [incidencias, setIncidencias] = useState([]);
  const [obras, setObras] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    fecha: "",
    descripcion: "",
    fotoUrl: "",
    estado: "Abierta",
    obraId: "",
    empleadoId: "",
  });
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarObras();
    cargarIncidencias();
  }, []);

  const cargarObras = async () => {
    try {
      let res = await axios.get("https://localhost:7119/api/Obras/Obra/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let obrasData = res.data.data;

      if (rol === "Empleado") {
        const asignacionesRes = await axios.get("https://localhost:7119/api/UsuarioObra", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const asignaciones = asignacionesRes.data.data;
        const obrasAsignadasIds = asignaciones.filter(a => a.usuarioId === usuario.id).map(a => a.obraId);
        obrasData = obrasData.filter(o => obrasAsignadasIds.includes(o.id));
      }

      if (rol === "Cliente") {
        obrasData = obrasData.filter(o => o.clienteId === usuario.id);
      }

      setObras(obrasData);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar obras");
    }
  };

  const cargarIncidencias = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/ParteAveria/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let datosFiltrados = res.data.data;
      if (rol === "Empleado") {
        datosFiltrados = datosFiltrados.filter(i => i.empleadoId === usuario.id);
      }
      if (rol === "Cliente") {
        const obrasCliente = await obtenerObrasCliente();
        const obrasIds = obrasCliente.map(o => o.id);
        datosFiltrados = datosFiltrados.filter(i => obrasIds.includes(i.obraId));
      }
      setIncidencias(datosFiltrados);
    } catch (err) {
      toast.error("Error al cargar incidencias");
    }
  };

  const obtenerObrasCliente = async () => {
    try {
      const res = await axios.get("https://localhost:7119/api/Obras/Obra/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data.filter(o => o.clienteId === usuario.id);
    } catch {
      return [];
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formDataFile = new FormData();
      formDataFile.append("file", file);
      const res = await axios.post("https://localhost:7119/api/Upload", formDataFile, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, fotoUrl: res.data.url }));
      toast.success("Imagen subida correctamente");
    } catch (err) {
      toast.error("Error al subir imagen");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        empleadoId: formData.empleadoId || usuario.id,
        fecha: formData.id === 0 ? new Date().toISOString() : formData.fecha,
      };
      await axios.post("https://localhost:7119/api/ParteAveria/save", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Incidencia guardada");
      setFormData({
        id: 0, fecha: "", descripcion: "", fotoUrl: "", estado: "Abierta", obraId: "", empleadoId: "",
      });
      setModalAbierto(false);
      cargarIncidencias();
    } catch (err) {
      toast.error("Error al guardar incidencia");
    }
  };

  const handleEdit = (incidencia) => {
    setFormData({ ...incidencia });
    setModalAbierto(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta incidencia?")) return;
    try {
      await axios.delete(`https://localhost:7119/api/ParteAveria/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Incidencia eliminada");
      cargarIncidencias();
    } catch (err) {
      toast.error("Error al eliminar incidencia");
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await axios.put(
        `https://localhost:7119/api/ParteAveria/cambiarEstado?id=${id}&estado=${nuevoEstado}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.result) {
        toast.success("Estado actualizado correctamente");
        cargarIncidencias();
      } else {
        toast.error(res.data.message || "No se pudo cambiar el estado");
      }
    } catch (err) {
      toast.error("Error al cambiar el estado");
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "Abierta": return "bg-red-100 text-red-800 border border-red-200";
      case "EnProceso": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Terminada": return "bg-green-100 text-green-800 border border-green-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-100 to-green-300 flex justify-center items-start py-6 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <img src={Logo} alt="FitoAqua Logo" className="mx-auto w-52 sm:w-64 h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-semibold text-blue-700">Incidencias</h2>
            {rol !== "Cliente" && (
              <button
                onClick={() => setFormData({ id: 0, descripcion: "", fotoUrl: "", estado: "Abierta", obraId: "", empleadiId: usuario.id }) || setModalAbierto(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md text-sm shadow-md whitespace-nowrap"
              >
                ➕ Añadir Incidencia
              </button>
            )}
          </div>

          {/* Tabla */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-blue-100 text-blue-700 text-sm">
                  <tr>
                    <th className="px-3 py-2">Fecha</th>
                    <th className="px-3 py-2">Descripción</th>
                    <th className="px-3 py-2">Foto</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2">Obra</th>
                    <th className="px-3 py-2">Empleado</th>
                    {rol === "Administrador" && <th className="px-3 py-2">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {incidencias.map((i) => (
                    <tr key={i.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-3 py-2">{new Date(i.fecha).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{i.descripcion}</td>
                      <td className="px-3 py-2">
                        {i.fotoUrl ? (
                          <img src={i.fotoUrl} alt="foto" className="w-16 h-16 object-cover rounded-lg cursor-pointer" onClick={() => window.open(i.fotoUrl, "_blank")} />
                        ) : (
                          <span className="text-xs text-gray-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(i.estado)}`}>{i.estado}</span>
                      </td>
                      <td className="px-3 py-2">{i.nombreObra || `Obra #${i.obraId}`}</td>
                      <td className="px-3 py-2">{i.nombreEmpleado || `Empleado #${i.empleadoId}`}</td>
                      {rol === "Administrador" && (
                        <td className="px-3 py-2 flex gap-2">
                          <select value={i.estado} onChange={(e) => cambiarEstado(i.id, e.target.value)} className="border px-1 py-1 text-xs rounded">
                            <option value="Abierta">Abierta</option>
                            <option value="EnProceso">En Proceso</option>
                            <option value="Terminada">Cerrada</option>
                          </select>
                          <button onClick={() => handleEdit(i)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs">Editar</button>
                          <button onClick={() => handleDelete(i.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Eliminar</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tarjetas */}
          <div className="lg:hidden space-y-3">
            {incidencias.map((i) => (
              <div key={i.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm text-gray-600">{new Date(i.fecha).toLocaleDateString()}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(i.estado)}`}>{i.estado}</span>
                </div>
                <div className="flex gap-3 mb-3">
                  {i.fotoUrl ? (
                    <img src={i.fotoUrl} alt="foto" className="w-16 h-16 object-cover rounded-lg cursor-pointer" onClick={() => setImagenAmpliada(i.fotoUrl)} />
                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">{i.descripcion}</p>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div><span className="font-medium">Obra:</span> {i.nombreObra || `Obra #${i.obraId}`}</div>
                      <div><span className="font-medium">Empleado:</span> {i.nombreEmpleado || `Empleado #${i.empleadoId}`}</div>
                    </div>
                  </div>
                </div>
                {rol === "Administrador" && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                    <select value={i.estado} onChange={(e) => cambiarEstado(i.id, e.target.value)} className="border px-1 py-1 text-sm rounded">
                      <option value="Abierta">Abierta</option>
                      <option value="EnProceso">En Proceso</option>
                      <option value="Terminada">Cerrada</option>
                    </select>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(i)} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-1 rounded text-sm">Editar</button>
                      <button onClick={() => handleDelete(i.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm">Eliminar</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {incidencias.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No hay incidencias registradas</p>
            </div>
          )}
        </div>

        {imagenAmpliada && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setImagenAmpliada(null)}>
            <img src={imagenAmpliada} alt="Ampliada" className="max-w-full max-h-full rounded-lg" />
          </div>
        )}

        <ModalIncidencia
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          onChange={handleChange}
          obras={obras}
          rol={rol}
          token={token}
        />

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Incidencias;
