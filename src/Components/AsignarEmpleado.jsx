import { useState, useEffect } from "react";
import axios from "axios";

function AsignarEmpleado() {
    const [usuarios, setUsuarios] = useState([]);
    const [obras, setObras] = useState([]);
    const [form, setForm] = useState({ usuarioId: "", obraId: "" });
    const [mensaje, setMensaje] = useState("");


    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    useEffect(() => {
        if (rol === "Administrador") {
            cargarEmpleados();
            cargarObras();
        }
    }, []);

    const cargarEmpleados = async () => {
        try {
            const res = await axios.get("https://localhost:7119/api/Usuarios/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const empleados = res.data.data.filter((u) => u.rol === "Empleado");
            setUsuarios(empleados);
        } catch (err) {
            console.error("Error al cargar empleados", err);
        }
    };

    const cargarObras = async () => {
        try {
            const res = await axios.get("https://localhost:7119/api/Obras/Obra/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setObras(res.data.data);
        } catch (err) {
            console.error("Error al cargar obras", err);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7119/api/UsuarioObra", {
                usuarioId: parseInt(form.usuarioId),
                obraId: parseInt(form.obraId),
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

           setMensaje("Empleado asignado con éxito");

            setTimeout(() => {
                setMensaje("");
            }, 3000); 
            setForm({ usuarioId: "", obraId: "" });
        } catch (err) {
            setMensaje("Hubo un error al asignar el empleado");
            setTimeout(() => setMensaje(""), 3000);

            alert("Hubo un error al asignar el empleado");
        }
    };

    if (rol !== "Administrador") return null;

    return (
        <div className="bg-white p-6 rounded shadow-md max-w-xl mb-8">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Asignar empleado a obra</h2>
            {mensaje && (
                <div className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded mb-4 text-sm">
                    {mensaje}
                </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Empleado</label>
                    <select
                        name="usuarioId"
                        value={form.usuarioId}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
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
                        value={form.obraId}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecciona una obra</option>
                        {obras.map((o) => (
                            <option key={o.id} value={o.id}>{o.nombre}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                    Asignar empleado
                </button>
            </form>
        </div>
    );
}

export default AsignarEmpleado;
