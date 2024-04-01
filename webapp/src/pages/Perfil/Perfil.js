import { Box, VStack, Heading, Text, Center, Spinner, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import axios from "axios";

const Perfil = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username,setUsername]=useState(localStorage.username || 'error');
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
  }, []);

  return (
    <>
      <Nav />
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
                    <div style={{ width: '100%' }}>
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
                                <Td>{game.correctAnswers}</Td>
                                <Td>{game.incorrectAnswers}</Td>
                                <Td>{game.points}</Td>
                                <Td>{game.avgTime} segundos</Td>
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
      <Footer />
    </>
  );
};

export default Perfil;

