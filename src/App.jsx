import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import Layout from "./Components/Layout";
import Obras from "./Views/Obras";
import Albaranes from "./Views/Albaranes";

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
