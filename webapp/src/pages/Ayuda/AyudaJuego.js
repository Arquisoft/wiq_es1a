import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Text} from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
const AyudaJuego = () => {
  
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.helpGame.title')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpGame.description')}
      </Text>
      <Heading as="h2" size="md">{t('pages.helpGame.classic')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpGame.classicDescription')}</Text>
      <Heading as="h2" size="md">{t('pages.helpGame.sabios')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpGame.sabiosDescription')}</Text>
      <Heading as="h2" size="md">{t('pages.helpGame.calculator')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpGame.calculatorDescription')}</Text>
      <Footer />
      </>
  );
};

export default AyudaJuego;
