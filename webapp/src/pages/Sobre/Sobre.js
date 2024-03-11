import React from "react";
import "./Sobre.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';

const Sobre = () => {
    return (
      <>
        <Nav />
        <div className="games-container">
          <hgroup>
            <h1>Estos son los diseñadores de la aplicación</h1>
            <h2>Martín Cancio Barrera - UO287561</h2>
            <h2>Iyán Fernández Riol - UO288231</h2>
            <h2>Rodrigo García Iglesias - UO276396</h2>
            <h2>Alfredo Jirout Cid - UO288443</h2>
          </hgroup>         
        </div>
        <Footer />
      </>
    );
  };
  
  export default Sobre;