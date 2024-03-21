import React from "react";
import Home from "./pages/Home/Home.js";
import Clasico from "./pages/Clasico/Clasico.js";
import Bateria from "./pages/Bateria/Bateria.js";
import WrongRoute from "./pages/WrongRoute/WrongRoute.js";
import Stats from "./pages/Stats/Stats.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routers/ProtectedRoute.js";
import Sobre from "./pages/Sobre/Sobre.js";
import Config from "./pages/Config/Config.js";
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register.js";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/** Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/** Rutas privadas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/home/clasico" element={<Clasico />} />
            <Route path="/home/bateria" element={<Bateria />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/config" element={<Config />} />
          </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<WrongRoute />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
