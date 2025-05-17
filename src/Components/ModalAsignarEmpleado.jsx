// src/Components/ModalAsignarEmpleado.jsx
import { useEffect } from "react";

function ModalAsignarEmpleado({ isOpen, onClose, onSubmit, usuarios, obras, selected, onChange }) {
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
        <h2 className="text-xl font-semibold text-blue-600 mb-4">Asignar Empleado a Obra</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Empleado</label>
            <select
              name="usuarioId"
              value={selected.usuarioId}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona un empleado</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Obra</label>
            <select
              name="obraId"
              value={selected.obraId}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona una obra</option>
              {obras.map((o) => (
                <option key={o.id} value={o.id}>{o.nombre}</option>
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalAsignarEmpleado;
