import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td, Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Perfil = (username) => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetch(gatewayUrl + `/userInfo?user=${username.username}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || 'Ha ocurrido un error al obtener el perfil');
        setLoading(false);
      });
      // eslint-disable-next-line
  }, []);

  return (
    <>
      <Center py={8}>
        <Box w="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg" width="100%">
          <VStack p={8} align="start" spacing={6}>
            <Heading as="h1" size="lg">
              {t('components.profile.profile')}
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
                    <Avatar name={username.username} />
                    <Text>
                      <strong>{t('components.profile.name')}</strong> {userData.username}
                    </Text>
                    <Text>
                      <strong>{t('components.profile.date')}</strong>{" "}
                      {new Date(userData.createdAt).toLocaleString()}
                    </Text>
                    <Heading as="h2" size="md">
                      {t('components.profile.recentGames')}z
                    </Heading>
                    <div style={{ width: '100%'}}>
                      {userData.games.length > 0 ? (
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>{t('components.profile.gameMode')}</Th>
                              <Th>{t('components.profile.correct')}</Th>
                              <Th>{t('components.profile.incorrect')}</Th>
                              <Th>{t('components.profile.score')}</Th>
                              <Th>{t('components.profile.avgTime')}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userData.games.slice(0, 10).map((game, index) => (
                            <Tr key={index}>
                              <Td>{game.gamemode}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.correctAnswers}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.incorrectAnswers}</Td>
                              <Td>{game.points}</Td>
                              <Td>{parseFloat(game.avgTime).toFixed(2)} {t('components.profile.seconds')}</Td>
                            </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>{t('components.profile.noGames')}</Text>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default Perfil;

