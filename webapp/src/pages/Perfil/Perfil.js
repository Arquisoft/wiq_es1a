import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const Perfil = () => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const username = localStorage.username || 'error';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(gatewayUrl + `/userInfo?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
        setError(error.message || 'Ha ocurrido un error al obtener el perfil');
        setLoading(false);
      });
      // eslint-disable-next-line
  }, []);

  return (
    <>
      <Nav />
      <Center py={8}>
        <Box w="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg" width="100%">
          <VStack p={8} align="start" spacing={6}>
            <Heading as="h1" size="lg">
              {t('pages.profile.title')}
            </Heading>
            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : (
              <>
                {userData && (
                  <>
                    <Text>
                      <strong>{t('pages.profile.nameLabel')}</strong> {userData.username}
                    </Text>
                    <Text>
                      <strong>{t('pages.profile.dateLabel')}</strong>{" "}
                      {new Date(userData.createdAt).toLocaleString()}
                    </Text>
                    <Heading as="h2" size="md">
                      {t('pages.profile.recentGames')}
                    </Heading>
                    <div style={{ width: '100%'}}>
                      {userData.games.length > 0 ? (
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>{t('pages.profile.gameMode')}</Th>
                              <Th>{t('pages.profile.correct')}</Th>
                              <Th>{t('pages.profile.incorrect')}</Th>
                              <Th>{t('pages.profile.score')}</Th>
                              <Th>{t('pages.profile.avgTime')}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userData.games.slice(0, 10).map((game, index) => (
                            <Tr key={index}>
                              <Td>{game.gamemode}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.correctAnswers}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.incorrectAnswers}</Td>
                              <Td>{game.points}</Td>
                              <Td>{parseFloat(game.avgTime).toFixed(2)} {t('pages.profile.seconds')}</Td>
                            </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>{t('pages.profile.nogames')}</Text>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </VStack>
        </Box>
      </Center>
      <Footer />
    </>
  );
};

export default Perfil;

