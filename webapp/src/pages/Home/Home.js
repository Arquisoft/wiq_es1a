import React from "react";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';
import { Box, Heading, Button, Flex, Spacer } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Nav />
      <Flex direction="column" align="center" justify="center" h="70vh">
        <Heading as="h1" mb={2}>¡Bienvenido a WIQ!</Heading>
        <Heading as="h2" size="md" mb={6}>Elige el modo de juego</Heading>
        <Box>
          <Button
            size="lg"
            colorScheme="teal"
            variant="outline"
            mb={4}
            onClick={() => handleNavigate("/home/clasico")}
          >
            Clásico
          </Button>
        </Box>
        <Box>
          <Button
            size="lg"
            colorScheme="teal"
            variant="outline"
            mb={4}
            onClick={() => handleNavigate("/home/bateria")}
          >
            Batería de sabios
          </Button>
        </Box>
        {/* Agrega más modos de juego aquí */}
      </Flex>
      <Footer />
    </>
  );
};

export default Home;
