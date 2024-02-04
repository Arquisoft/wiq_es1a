import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <h1>Bienvenido a WIQ. Selecciona un modo de juego</h1>
            <Link to="clasico"></Link>
        </>
    )
}

export default Home;