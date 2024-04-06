import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td, Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const Perfil = (username) => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

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
              Perfil del usuario
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
                      <strong>Nombre de usuario:</strong> {userData.username}
                    </Text>
                    <Text>
                      <strong>Fecha de creación de la cuenta:</strong>{" "}
                      {new Date(userData.createdAt).toLocaleString()}
                    </Text>
                    <Heading as="h2" size="md">
                      Partidas Recientes
                    </Heading>
                    <div style={{ width: '100%'}}>
                      {userData.games.length > 0 ? (
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Modo de juego</Th>
                              <Th>Respuestas correctas</Th>
                              <Th>Respuestas incorrectas</Th>
                              <Th>Puntos</Th>
                              <Th>Tiempo promedio</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userData.games.slice(0, 10).map((game, index) => (
                            <Tr key={index}>
                              <Td>{game.gamemode}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.correctAnswers}</Td>
                              <Td>{game.gamemode === 'calculadora' ? '-' : game.incorrectAnswers}</Td>
                              <Td>{game.points}</Td>
                              <Td>{parseFloat(game.avgTime).toFixed(2)} segundos</Td>
                            </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      ) : (
                        <Text>No hay partidas recientes.</Text>
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

