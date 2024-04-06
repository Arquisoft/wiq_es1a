import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import Profile from "../../components/Profile/Profile.js";

const Perfil = () => {
  return (
    <>
      <Nav />
      <Profile username={localStorage.getItem('username')} />
      <Footer />
    </>
  );
};

export default Perfil;

