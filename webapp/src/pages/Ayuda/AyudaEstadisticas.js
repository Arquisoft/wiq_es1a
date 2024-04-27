import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading,Text } from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const AyudaEstadisticas = () => {
  
    const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h2">{t('pages.helpStats.title')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpStats.description')}
      </Text>
      <Heading as="h2">{t('pages.helpStats.title2')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpStats.description2')}</Text>
      <Footer />
      </>
  );
};

export default AyudaEstadisticas;