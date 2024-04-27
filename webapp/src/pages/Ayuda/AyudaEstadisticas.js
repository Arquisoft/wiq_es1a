import React from 'react';

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
      </>
  );
};

export default AyudaEstadisticas;