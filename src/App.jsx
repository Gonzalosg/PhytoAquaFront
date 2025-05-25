import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Layout from "./Components/Layout";
import Obras from "./Views/Obras";
import Albaranes from "./Views/Albaranes";
import Usuarios from "./Views/Usuarios";
import Inventario from "./Views/Inventario";
import Incidencias from "./Views/Incidencias";


function App() {

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="obras" element={<Obras />} />
          <Route path="albaranes" element={<Albaranes />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="incidencias" element={<Incidencias />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
