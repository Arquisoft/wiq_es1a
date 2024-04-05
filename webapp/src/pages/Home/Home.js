import React from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import CustomModal from "../../components/CustomModal/CustomModal.js";
import { Box, Heading, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Background from "../../components/Background/Background.js";

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error");

  return (
    <>
      <Nav />
      <Background />
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
        <Box p={2}>
          <CustomModal
            title="Calculadora Humana"
            text="
              En el modo Calculadora Humana, tendrás que resolver operaciones matemáticas en un tiempo limitado. 
              ¡Demuestra tus habilidades matemáticas y rapidez para superar este desafío!
            "
            route="/home/calculadora"
          />
        </Box>
        {error && (
          <Box mb={4} color="red">
            Hubo un error al cargar las preguntas. Por favor, inténtalo más tarde.
          </Box>
        )}
      </Flex>
      <Footer />
    </>
  );
};

export default Home;
