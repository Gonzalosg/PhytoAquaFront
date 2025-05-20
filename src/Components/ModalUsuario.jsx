// src/Components/ModalCrearUsuario.jsx
function ModalUsuario({ isOpen, onClose, onSubmit, formData, onChange }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Crear / Editar Usuario</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              required={formData.id === 0} // Solo es obligatorio si es nuevo usuario
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={onChange}
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
    </div>
  );
}

export default ModalUsuario;
