import React from 'react';
import './Home.css';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className='games-container'>
            <h1>Bienvenido a WIQ. Selecciona un modo de juego</h1>
            <ul>
                <a href="home/clasico">Clásico</a>
                <a href="home/bateria">Batería de sabios</a>
                <a href="home/descartando">Descartando</a>
                <a href="home/pregunta">La pregunta caliente</a>
                <a href="home/descubriendo">Descubriendo ciudades</a>
            </ul>
        </div>
    )
}

export default Home;