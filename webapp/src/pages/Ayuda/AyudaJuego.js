import React from 'react';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
=======
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

>>>>>>> a8ab90c201bf92f078a3df55ce8bb921238ae03d
const AyudaModosJuego = () => {
  
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.helpGame.title')}</Heading>
      <p>{t('pages.helpGame.description')}
      </p>
      <Heading as="h2" size="md">{t('pages.helpGame.classic')}</Heading>
      <p>{t('pages.helpGame.classicDescription')}</p>
      <Heading as="h2" size="md">{t('pages.helpGame.sabios')}</Heading>
      <p>{t('pages.helpGame.sabiosDescription')}</p>
      <Heading as="h2" size="md">{t('pages.helpGame.calculator')}</Heading>
      <p>{t('pages.helpGame.calculatorDescription')}</p>
      <Footer />
      </>
  );
};

export default AyudaModosJuego;
