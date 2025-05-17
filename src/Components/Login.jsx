import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://localhost:7119/api/Login", {
        email: email,
        contrasenia: password,
      });

      const token = response.data.data.token;
      const rol = response.data.data.usuario.rol;
      const usuario = response.data.data.usuario;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
    {/* Espacio superior con título */}
    <div className="mb-10">
      <h1
        className="text-5xl font-bold text-blue-700"
        style={{ fontFamily: "Candara, sans-serif" }}
      >
        PhytoAqua WebApp
      </h1>
    </div>

    {/* Caja del formulario */}
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Iniciar sesión</h2>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-300"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
);

}

export default Login;
