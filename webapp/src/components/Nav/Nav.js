import React from 'react';
import { Link } from "react-router-dom";
import './Nav.css';

const Nav = () => {
    return(
        <nav>
            <h1 className="logo">WIQ!</h1>
            <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/sobre">Sobre nosotros</Link></li>
            </ul>
        </nav>
    );
}

export default Nav;