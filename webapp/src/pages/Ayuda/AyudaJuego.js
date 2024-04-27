import React from 'react';

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
      <Heading as="h3" size="md">{t('pages.helpGame.sabios')}</Heading>
      <p>{t('pages.helpGame.sabiosDescription')}</p>
      <Heading as="h4" size="md">{t('pages.helpGame.calculator')}</Heading>
      <p>{t('pages.helpGame.calculatorDescription')}</p>
      </>
  );
};

export default AyudaModosJuego;
