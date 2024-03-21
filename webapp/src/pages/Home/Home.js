import React from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import CustomModal from "../../components/CustomModal/CustomModal.js";
import { Box, Heading, Flex } from "@chakra-ui/react";

const Home = () => {
  return (
    <>
      <Nav />
      <Flex direction="column" align="center" justify="center" h="70vh">
        <Heading as="h1" mb={2}>
          ¡Bienvenido a WIQ!
        </Heading>
        <Heading as="h2" size="md" mb={6}>
          Elige el modo de juego
        </Heading>
        <Box p={2}>
          <CustomModal 
            title="Modo Clásico" 
            text="
              En el modo Clásico, tendrás que responder un número determinado de preguntas en un tiempo limitado. 
              ¡Demuestra tus conocimientos y rapidez para superar este desafío!
            " 
            route="/home/clasico" 
          />
        </Box>
        <Box p={2}>
          <CustomModal
            title="Batería de Sabios"
            text="
              En el modo Batería de Sabios, pondrás a prueba tu conocimiento respondiendo todas las preguntas que puedas en un tiempo fijo. 
              Cuantas más preguntas aciertes, ¡mejor será tu puntuación! ¿Estás listo para este desafío cronometrado?
            "
            route="/home/bateria"
          />
        </Box>
        {/* Agrega más modos de juego aquí */}
      </Flex>
      <Footer />
    </>
  );
};

export default Home;
