import React from "react";
import "./WrongRoute.css";
import { Link } from 'react-router-dom';

const WrongRoute = () => {
  return (
    <div id="notfound">
      <div class="notfound-bg">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="notfound">
        <div class="notfound-404">
          <h1>404</h1>
        </div>
        <h2>Página no encontrada</h2>
        <p>
          La página que estabas buscando no está disponible
        </p>
        <Link to="/home">Página principal</Link>
      </div>
    </div>
  );
};

export default WrongRoute;
