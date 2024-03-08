import React from 'react';
import { Link } from "react-router-dom";
import './Nav.css';

const Nav = () => {
    const Logout = () =>{
        localStorage.removeItem('token')
    }
    return(
        <nav>
            <h1 className="logo">WIQ!</h1>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/sobre">Sobre nosotros</Link></li>
                <li><Link to="/stats">Stats</Link></li>
            </ul>
            <button onClick={() => Logout()}>Desconectarse</button>
        </nav>
    );
}

export default Nav;