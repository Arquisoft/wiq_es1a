import React, { useState } from 'react';
import Authenticate from './pages/Authenticate/Authenticate.js';
import Home from './pages/Home/Home.js';
import Clasico from './pages/Clasico/Clasico.js';
import Bateria from './pages/Bateria/Bateria.js';
import WrongRoute from './pages/WrongRoute/WrongRoute.js';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

//Autentificamos que el usuario este registrado en la aplicación
//const [authenticated, setAuthenticated] = useState(false);
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/** Rutas públicas */}
        <Route path='/' element={<Authenticate />} />

        {/** Rutas privadas */}
        <Route path='/home' element={<Home />} />
        <Route path='/home/clasico' element={<Clasico />} />

  return (
    <BrowserRouter>
      <Routes>
        {/** Rutas públicas */}
        <Route path='/' element={<Authenticate />} />

        {/** Rutas privadas */}
        <Route path='/home' element={<Home />} />
        <Route path='/home/clasico' element={<Clasico />} />
        <Route path='/home/bateria' element={<Bateria />} />

        {/* Ruta por defecto */}
        <Route path='*' element={<WrongRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;