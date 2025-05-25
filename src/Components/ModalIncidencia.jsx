import axios from "axios";
import { toast } from "react-toastify";

function ModalIncidencia({ isOpen, onClose, onSubmit, formData, setFormData, onChange, obras, rol, token }) {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          {formData.id === 0 ? "Nueva Incidencia" : "Editar Incidencia"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Subida de foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subir Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded"
            />
            {formData.fotoUrl && (
              <img
                src={formData.fotoUrl}
                alt="Vista previa"
                className="w-full max-h-64 object-contain mt-2 cursor-pointer"
                onClick={() => window.open(formData.fotoUrl, "_blank")}
              />
            )}
          </div>

          {/* Obra */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Obra</label>
            <select
              name="obraId"
              value={formData.obraId}
              onChange={onChange}
              required
              className="w-full border px-3 py-2 rounded"
              disabled={formData.id !== 0} // Deshabilitar al editar
            >
              <option value="">Selecciona una obra</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          {rol === "Administrador" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={onChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Abierta">Abierta</option>
                <option value="EnProceso">En Proceso</option>
                <option value="Terminada">Cerrada</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Guardar Incidencia
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalIncidencia;
