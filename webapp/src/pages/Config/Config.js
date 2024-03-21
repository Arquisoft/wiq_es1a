import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Checkbox,
  Input,
  Button,
  FormLabel,
  Stack
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Config = () => {
  const [clasicoTime, setClasicoTime] = useState(
    localStorage.getItem("clasicoTime")
  );
  const [clasicoPreguntas, setClasicoPreguntas] = useState(
    localStorage.getItem("clasicoPreguntas")
  );
  const [bateriaTime, setBateriaTime] = useState(
    localStorage.getItem("bateriaTime")
  );

  const handleConfig = () => {
    const checkboxes = document.querySelectorAll(
      '.topicCheckboxes input[type="checkbox"]'
    );
    const selectedThemes = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedThemes.push(checkbox.id);
      }
    });

    if (selectedThemes.length === 0) {
      alert("Debe haber al menos una temática seleccionada");
    } else {
      localStorage.setItem("selectedThemes", JSON.stringify(selectedThemes));
      localStorage.setItem("clasicoTime", clasicoTime);
      localStorage.setItem("clasicoPreguntas", clasicoPreguntas);
      localStorage.setItem("bateriaTime", bateriaTime);

      alert("Cambios realizados satisfactoriamente");
    }
  };

  const handleClasicoChange = (event) => {
    setClasicoTime(parseInt(event.target.value));
  };

  const handleClasicoPreguntas = (event) => {
    setClasicoPreguntas(parseInt(event.target.value));
  };

  const handleBateriaChange = (event) => {
    setBateriaTime(parseInt(event.target.value));
  };

  return (
    <>
      <Nav />
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="70vh"
        w="70vw"
      >
        <Box className="configContainer">
          <Heading as="h2" mb={4}>
            Configuración
          </Heading>
          <FormLabel htmlFor="clasico"> Temáticas de preguntas</FormLabel>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
            gridGap={4}
            alignItems="start"
          >
            <Stack spacing={5} direction="row">
              <Checkbox id="paises" mb={2}>
                Países
              </Checkbox>
              <Checkbox id="literatura" mb={2}>
                Literatura
              </Checkbox>
              <Checkbox id="cine" mb={2}>
                Cine
              </Checkbox>
              <Checkbox id="arte" mb={2}>
                Arte
              </Checkbox>
              <Checkbox id="programacion" mb={2}>
                Programación
              </Checkbox>
            </Stack>
          </Box>

          <Box>
            <FormLabel htmlFor="clasico">
              {" "}
              Tiempo entre preguntas (Clásico)
            </FormLabel>
            <Input
              id="clasico"
              value={clasicoTime}
              type="number"
              min="5"
              max="20"
              onChange={handleClasicoChange}
              mb={2}
            />
            <FormLabel htmlFor="clasicoPreguntas">
              {" "}
              Número de preguntas (Clásico)
            </FormLabel>
            <Input
              id="clasicoPreguntas"
              value={clasicoPreguntas}
              type="number"
              min="1"
              max="1000"
              onChange={handleClasicoPreguntas}
              mb={2}
            />
            <FormLabel htmlFor="bateria">
              Tiempo total (Batería de sabios)
            </FormLabel>
            <Input
              id="bateria"
              value={bateriaTime}
              type="number"
              min="30"
              max="600"
              onChange={handleBateriaChange}
              mb={4}
            />
          </Box>
          <Button colorScheme="teal" onClick={handleConfig} mb={4}>
            Aplicar cambios
          </Button>
        </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default Config;
