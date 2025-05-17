// src/Components/ModalCrearObra.jsx
import { useEffect } from "react";

function ModalCrearObra({ isOpen, onClose, onSubmit, formData, onChange, usuarios }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          {formData.id === 0 ? "Crear Obra" : "Editar Obra"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cliente</label>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona un cliente</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {formData.id === 0 ? "Crear" : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalCrearObra;
