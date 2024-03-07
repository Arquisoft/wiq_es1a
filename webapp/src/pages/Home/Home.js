import React from "react";
import "./Home.css";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const error = searchParams.get("error");

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
          {/* <Link to="descartando">Descartando</Link>
          <Link to="pregunta">La pregunta caliente</Link>
          <Link to="descubriendo">Descubriendo ciudades</Link> */}
        </ul>
        {error && <p>Hubo un error al cargar las preguntas. Inténtalo más tarde</p>}
      </div>
      <Footer />
    </>
  );
};

export default Home;