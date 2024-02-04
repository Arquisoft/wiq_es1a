import React, { useState } from 'react';
import Authenticate from './pages/Authenticate';
import Home from './pages/Home.js';
import Clasico from './pages/Authenticate';

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
         </Routes>
       </BrowserRouter>
     </AuthProvider>
   );
 };

export default App;
