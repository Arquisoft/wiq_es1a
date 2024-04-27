import React from 'react';
import { useTranslation } from 'react-i18next';

import { Heading, Text} from '@chakra-ui/react';

import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const AyudaSocial = () => {
  
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.helpSocial.title')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpSocial.description')}
      </Text>
      <Heading as="h2" size="md">{t('pages.helpSocial.friends')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpSocial.description2')}</Text>
      <Heading as="h2" size="md">{t('pages.helpSocial.groups')}</Heading>
      <Text maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"}>{t('pages.helpSocial.description3')}</Text>
      <Footer />
      </>
  );
};

export default AyudaSocial;