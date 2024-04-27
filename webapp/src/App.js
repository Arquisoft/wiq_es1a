import React, { useEffect } from "react";
import Home from "./pages/Home/Home.js";
import Clasico from "./pages/Clasico/Clasico.js";
import Bateria from "./pages/Bateria/Bateria.js";
import WrongRoute from "./pages/WrongRoute/WrongRoute.js";
import Stats from "./pages/Stats/Stats.js";
import Ranking from "./pages/Ranking/Ranking.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./routers/ProtectedRoute.js";
import Sobre from "./pages/Sobre/Sobre.js";
import Config from "./pages/Config/Config.js";
import Login from "./components/Login/Login.js";
import Register from "./components/Register/Register.js";
import Perfil from "./pages/Perfil/Perfil.js";
import CalculadoraHumana from "./pages/Calculadora/Calculadora.js";
import UsersPage from "./pages/Social/UsersPage.js";
import FriendList from "./pages/Social/FriendsList.js";
import Groups from "./pages/Social/Groups.js";
import UserGroups from "./pages/Social/UserGroups.js";
import GroupDetails from "./pages/Social/GroupDetails.js";
import History from "./pages/History/History.js";
import Help from "./pages/Ayuda/Ayuda.js";
import HelpGames from "./pages/Ayuda/AyudaJuego.js";
import HelpStats from ".pages/Ayuda/AyudaEstadisticas.js"
import HelpSocial from "./pages/Ayuda/AyudaSocial.js";


function App() {
  useEffect(() => {
    document.title = "WIQ!";
  }, []);
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
          <Route path="/home/calculadora" element={<CalculadoraHumana />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/social/usuarios" element={<UsersPage />} />
          <Route path="/social/amigos" element={<FriendList />} />
          <Route path="/social/grupos" element={<Groups />} />
          <Route path="/social/misgrupos" element={<UserGroups />} />
          <Route path="/social/grupo/:groupName" element={<GroupDetails />} />
          <Route path="/ayuda" element={<Help/>} />
          <Route path="/ayuda/modos-de-juego" element={<HelpGames/>} />
          <Route path="/ayuda/estadisticas" element={<HelpStats/>} />
          <Route path="/ayuda/social" element={<HelpSocial/>} />
          <Route path="/perfil/:user" element={<Perfil />} />
          <Route path="/history" element={<History />} />
          <Route path="/config" element={<Config />} />
        </Route>

          {/* Ruta por defecto */}
          <Route path="*" element={<WrongRoute />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
