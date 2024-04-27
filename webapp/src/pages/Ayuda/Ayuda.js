import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const Ayuda = () => {
  const { t } = useTranslation();

  return (
    <>
      <Nav />
      <Heading as="h1">{t('pages.help.title')}</Heading>
      <Heading maxWidth={{base: "100%", lg:"40%"}} textAlign={"justify"} as="h2" size="md">
        {t('pages.help.description')}
      </Heading>
      <Table maxWidth={{base: "100%", lg:"40%"}} className="help-table" id="help-table">
        <Thead>
          <Tr>
            <Th>{t('pages.help.category')}</Th>
            <Th>{t('pages.help.descriptionC')}</Th>
            <Th>{t('pages.help.details')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{t('pages.help.gameModes')}</Td>
            <Td textAlign={"justify"}>
              {t('pages.help.gameModesDescription')}
            </Td>
            <Td>
              <a href="/ayuda/modos-de-juego">{t('pages.help.moreDetails')}</a>
            </Td>
          </Tr>
          <Tr>
            <Td>{t('pages.help.socialHelp')}</Td>
            <Td textAlign={"justify"}>
              {t('pages.help.socialHelpDescription')}
            </Td>
            <Td>
              <a href="/ayuda/social">{t('pages.help.moreDetails')}</a>
            </Td>
          </Tr>
          <Tr>
            <Td>{t('pages.help.statsHelp')}</Td>
            <Td textAlign={"justify"}>
              {t('pages.help.statsHelpDescription')}
            </Td>
            <Td>
              <a href="/ayuda/estadisticas">{t('pages.help.moreDetails')}</a>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Footer />
    </>
  );
};

export default Ayuda;