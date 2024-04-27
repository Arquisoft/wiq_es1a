import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Checkbox,
  Button,
  FormLabel,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Config = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Obtain the selected themes from localStorage and check the checkboxes
    const selectedThemes =
      JSON.parse(localStorage.getItem("selectedThemes")) || [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      // Verify if the checkbox id is in the selected themes array
      if (selectedThemes.includes(checkbox.id)) {
        checkbox.click();
      }
    });
    // eslint-disable-next-line
  }, []);
  const navigate = useNavigate();

  const [clasicoTime, setClasicoTime] = useState(
    localStorage.getItem("clasicoTime") || 10
  );
  const [clasicoPreguntas, setClasicoPreguntas] = useState(
    localStorage.getItem("clasicoPreguntas") || 10
  );
  const [bateriaTime, setBateriaTime] = useState(
    localStorage.getItem("bateriaTime") || 180
  );

  const handleConfig = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
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
      navigate("/home");
    }
  };

  const handleClasicoChange = (valueString) => {
    setClasicoTime(parseInt(valueString)); 
  };

  const handleClasicoPreguntasChange = (valueString) => {
    setClasicoPreguntas(parseInt(valueString)); 
  };

  const handleBateriaChange = (valueString) => {
    setBateriaTime(parseInt(valueString)); 
  };

  return (
    <>
      <Nav />
      <Flex direction="column" align="center" justify="center">
        <Box className="configContainer" maxW={"80%"}>
          <Heading as="h2" mb={4}>
            {t("pages.config.title")}
          </Heading>
          <FormLabel htmlFor="idioma">{t("pages.config.language")}</FormLabel>
          <Flex direction="row" align="center" justify="space-around">
            <Button
              colorScheme="teal"
              onClick={() => i18n.changeLanguage("es")}
            >
              Español
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => i18n.changeLanguage("en")}
            >
              English
            </Button>
          </Flex>
          <FormLabel htmlFor="clasico">{t("pages.config.topics")}</FormLabel>
          <Stack spacing={5} direction="row" wrap={"wrap"} justifyContent={"center"}>
            <Checkbox id="paises" mb={2}>
              {t("pages.config.countries")}
            </Checkbox>
            <Checkbox id="literatura" mb={2}>
              {t("pages.config.literature")}
            </Checkbox>
            <Checkbox id="cine" mb={2}>
              {t("pages.config.cinema")}
            </Checkbox>
            <Checkbox id="arte" mb={2}>
              {t("pages.config.art")}
            </Checkbox>
            <Checkbox id="programacion" mb={2}>
              {t("pages.config.programming")}
            </Checkbox>
            <Checkbox id="futbolistas" mb={2}>
              {t("pages.config.futbolistas")}
            </Checkbox>
            <Checkbox id="clubes" mb={2}>
              {t("pages.config.clubes")}
            </Checkbox>
            <Checkbox id="baloncestistas" mb={2}>
              {t("pages.config.baloncestistas")}
            </Checkbox>
            <Checkbox id="politica" mb={2}>
              {t("pages.config.politica")}
            </Checkbox>
            <Checkbox id="videojuegos" mb={2}>
              {t("pages.config.videojuegos")}
            </Checkbox>
          </Stack>
          <Box>
            <FormLabel htmlFor="clasico">
              {" "}
              {t("pages.config.timeBetweenClassic")}
            </FormLabel>
            <NumberInput
              id="clasico"
              value={clasicoTime}
              type="number"
              min={5}
              max={50}
              onChange={handleClasicoChange}
              mb={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel htmlFor="clasicoPreguntas">
              {" "}
              {t("pages.config.questionCountClassic")}
            </FormLabel>
            <NumberInput
              id="clasicoPreguntas"
              value={clasicoPreguntas}
              type="number"
              min={1}
              max={1000}
              onChange={handleClasicoPreguntasChange}
              mb={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormLabel htmlFor="bateria">
              {t("pages.config.totalTimeBattery")}
            </FormLabel>
            <NumberInput
              id="bateria"
              value={bateriaTime}
              type="number"
              min={30}
              max={600}
              onChange={handleBateriaChange}
              mb={2}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Button colorScheme="teal" onClick={handleConfig} mb={4}>
            {t("pages.config.save")}
          </Button>
        </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default Config;
