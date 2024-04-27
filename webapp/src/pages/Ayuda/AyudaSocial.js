import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const AyudaSocial = () => {
  
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.helpSocial.title')}</Heading>
      <p>{t('pages.helpSocial.description')}
      </p>
      <Heading as="h2" size="md">{t('pages.helpSocial.friends')}</Heading>
      <p>{t('pages.helpSocial.description2')}</p>
      <Heading as="h3" size="md">{t('pages.helpSocial.groups')}</Heading>
      <p>{t('pages.helpSocial.description3')}</p>
      <Footer />
      </>
  );
};

export default AyudaSocial;