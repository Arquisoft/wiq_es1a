import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td, Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const Perfil = () => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user=useParams();
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    fetch(gatewayUrl + `/userInfo/${user}`)
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
      <Center py={8} maxWidth={"90%"}>
        <Box w="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg" width="100%">
          <VStack p={8} align="center" spacing={6}>
            <Heading as="h1" size="lg">
              {t('components.profile.profile')}
            </Heading>
            {loading ? (
              <Center>
                <Spinner />
              </Center>
            ) : error ? (
              <Text>{t('pages.profile.error')}</Text>
            ) : (
              <>
                {userData && (
                  <>
                    <Avatar name={user} />
                    <Text justifyContent={"center"}>
                      <strong>{t('components.profile.name')}</strong> {userData.username}
                    </Text>
                    <Text>
                      <strong>{t('components.profile.date')}</strong>{" "}
                      {new Date(userData.createdAt).toLocaleString()}
                    </Text>
                    <Heading as="h2" size="md">
                      {t('components.profile.recentGames')}
                    </Heading>
                    <Box overflowX={"scroll"} width={'100%'}>
                      { userData.games && userData.games.length > 0 ? (
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th textAlign={"center"}>{t('components.profile.gameMode')}</Th>
                              <Th textAlign={"center"}>{t('components.profile.correct')}</Th>
                              <Th textAlign={"center"}>{t('components.profile.incorrect')}</Th>
                              <Th textAlign={"center"}>{t('components.profile.score')}</Th>
                              <Th textAlign={"center"}>{t('components.profile.avgTime')}</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userData.games.slice(0, 10).map((game, index) => (
                            <Tr key={index}>
                              <Td textAlign={"center"}>{game.gamemode}</Td>
                              <Td textAlign={"center"}>{game.gamemode === 'calculadora' ? '-' : game.correctAnswers}</Td>
                              <Td textAlign={"center"}>{game.gamemode === 'calculadora' ? '-' : game.incorrectAnswers}</Td>
                              <Td textAlign={"center"}>{game.points}</Td>
                              <Td textAlign={"center"}>{parseFloat(game.avgTime).toFixed(2)} {t('components.profile.seconds')}</Td>
                            </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>{t('components.profile.noGames')}</Text>
                      )}
                    </Box>
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

