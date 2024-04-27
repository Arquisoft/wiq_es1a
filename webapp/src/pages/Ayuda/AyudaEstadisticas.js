import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading} from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const AyudaEstadisticas = () => {
  
    const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.helpSats.title')}</Heading>
      <p>{t('pages.helpStats.description')}
      </p>
      <Heading as="h2">{t('pages.helpSats.title2')}</Heading>
      <p>{t('pages.helpStats.description2')}</p>
      <Footer />
      </>
  );
};

export default AyudaEstadisticas;