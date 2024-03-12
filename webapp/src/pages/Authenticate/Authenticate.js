import React, { useState } from "react";
import AddUser from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import Footer from "../../components/Footer/Footer.js";
import "./Authenticate.css";

function Authenticate() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="main">
      <h1 className="logo">WIQ</h1>
      <div>
        {showLogin ? <Login /> : <AddUser />}
        <div>
          {showLogin ? (
            <button className="gotoregister" onClick={handleToggleView}>
              ¿No tienes cuenta? Regístrate.
            </button>
          ) : (
            <button className="gotologin" onClick={handleToggleView}>
              Ya tienes cuenta? Inicia sesión.
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Authenticate;
