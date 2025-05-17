function CrearObraDesktop({ formData, onChange, onSubmit, usuarios }) {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mb-8">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Crear / Editar Obra</h2>

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
            {usuarios.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Guardar Obra
        </button>
      </form>
    </div>
  );
}

export default CrearObraDesktop;
