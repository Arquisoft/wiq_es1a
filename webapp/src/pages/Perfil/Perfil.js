import React from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import Profile from "../../components/Profile/Profile.js";

const Perfil = (username) => {
  return (
    <>
      <Nav />
      <Profile username={username ? username: localStorage.getItem('username')} />
      <Footer />
    </>
  );
};

export default Perfil;

