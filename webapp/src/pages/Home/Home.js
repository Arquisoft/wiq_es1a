import React from 'react';
import './Home.css';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1>Bienvenido a WIQ. Selecciona un modo de juego</h1>
            <ul>
                <a href="clasico">Clásico</a>
                <a href="clasico">Batería de sabios</a>
                <a href="clasico">Descartando</a>
                <a href="clasico">La pregunta caliente</a>
                <a href="clasico">Descubriendo ciudades</a>
            </ul>
        </>
    )
}

export default Home;