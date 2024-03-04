import React from "react";
import "./Home.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Nav />
      <div className="games-container">
        <hgroup>
          <h1>Bienvenido</h1>
          <h2>Selecciona un modo de juego</h2>
        </hgroup>         
        <ul>
          <Link to="clasico">Clásico</Link>
          <Link to="bateria">Batería de sabios</Link>
          <Link to="descartando">Descartando</Link>
          <Link to="pregunta">La pregunta caliente</Link>
          <Link to="descubriendo">Descubriendo ciudades</Link>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Home;