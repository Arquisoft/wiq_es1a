import React, { useState } from 'react';
import Authenticate from './pages/Authenticate/Authenticate.js';
import Home from './pages/Home/Home.js';
import Clasico from './pages/Clasico/Clasico.js';
import WrongRoute from './pages/WrongRoute/WrongRoute.js';
import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom";
import AuthProvider from 'react-auth-kit';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import createStore from 'react-auth-kit/createStore';

const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:'
})
 
 const App = () => {
   return (
     <AuthProvider store={store}>
       <BrowserRouter>
         <Routes>
           {/** Rutas públicas */}
           <Route path={'/'} element={<Authenticate />}/>
 
           {/** Rutas privadas */}
           <Route element={<AuthOutlet fallbackPath='/' />}>
             <Route path='/home' element={<Home />} />
             <Route path='/home/clasico' element={<Clasico />} />
           </Route>

           <Route path='*' element={<WrongRoute />} />
         </Routes>
       </BrowserRouter>
     </AuthProvider>
   );
 };

export default App;
