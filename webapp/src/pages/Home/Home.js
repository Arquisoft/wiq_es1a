import React from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import CustomModal from "../../components/CustomModal/CustomModal.js";
import { Box, Heading, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Background from "../../components/Background/Background.js";
import { useTranslation } from "react-i18next";

const Home = () => {
  const testEnvironment = process.env.NODE_ENV === "test";
  
  const { t } = useTranslation();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const error = queryParams.get("error");

  return (
    <>
      <Nav />
      {!testEnvironment && <Background />}
      <Flex direction="column" align="center" justify="center" h="70vh">
        <Heading as="h1" mb={2}>
          {t('pages.home.title')}
        </Heading>
        <Heading as="h2" size="md" mb={6}>
          {t('pages.home.choose')}
        </Heading>
        <Box p={2}>
          <CustomModal
            title={t('pages.home.classic')}
            text={t('pages.home.classicDescription')}
            route="/home/clasico"
            data-testid="classic"
          />
        </Box>
        <Box p={2}>
          <CustomModal
            title={t('pages.home.wisebattery')}
            text={t('pages.home.wisebatteryDescription')}
            route="/home/bateria"
            data-testid="battery"
          />
        </Box>
        <Box p={2}>
          <CustomModal
            title={t('pages.home.humancalculator')}
            text={t('pages.home.humancalculatorDescription')}
            route="/home/calculadora"
            data-testid="calculator"
          />
        </Box>
        {error && (
          <Box mb={4} color="red">
            {t('pages.home.error')}
          </Box>
        )}
      </Flex>
      <Footer />
    </>
  );
};

export default Home;
