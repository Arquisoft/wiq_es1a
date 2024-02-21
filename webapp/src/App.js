import React, { useState } from 'react';
import Authenticate from './pages/Authenticate/Authenticate.js';
import Home from './pages/Home/Home.js';
import Clasico from './pages/Clasico/Clasico.js';
import WrongRoute from './pages/WrongRoute/WrongRoute.js';
import './App.css';

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

//Autentificamos que el usuario este registrado en la aplicación
const [authenticated, setAuthenticated] = useState(false);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/** Rutas públicas */}
        <Route path='/' element={<Authenticate setAuthenticated={setAuthenticated} />} />

        /**Rutas que estan protegidas si no estas registrado */
        {/** Rutas privadas */}
        {authenticated ? (
          <>
            <Route path='/home' element={<Home />} />
            <Route path='/home/clasico' element={<Clasico />} />
          </>
        ) : (
          <Navigate to="/" />
        )}

        {/* Ruta por defecto */}
        <Route path='*' element={<WrongRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;