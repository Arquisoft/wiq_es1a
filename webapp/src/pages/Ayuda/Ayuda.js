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
      <Heading as="h2" size="md">
        {t('pages.help.description')}
      </Heading>
      <Table className="help-table" id="help-table">
        <Thead>
          <Tr>
            <Th>{t('pages.help.category')}</Th>
            <Th>{t('pages.help.descriptionC')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{t('pages.help.gameModes')}</Td>
            <Td>
              {t('pages.help.gameModesDescription')}{' '}
              <a href="/ayuda/modos-de-juego">{t('pages.help.moreDetails')}</a>
            </Td>
          </Tr>
          <Tr>
            <Td>{t('pages.help.socialHelp')}</Td>
            <Td>
              {t('pages.help.socialHelpDescription')}{' '}
              <a href="/ayuda/social">{t('pages.help.moreDetails')}</a>
            </Td>
          </Tr>
          <Tr>
            <Td>{t('pages.help.statsHelp')}</Td>
            <Td>
              {t('pages.help.statsHelpDescription')}{' '}
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