import { Box, VStack, Heading, Text, Center, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Perfil = () => {
  const gatewayUrl = process.env.GATEWAY_SERVICE_URL || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username,setUsername]=useState(localStorage.username);
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
    <Center py={8}>
      <Box w="xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
        <VStack p={8} align="start" spacing={6}>
          <Heading as="h1" size="lg">
            Detalles del Usuario
          </Heading>
          {loading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <>
              <Text>
                <strong>Nombre de Usuario:</strong> {userData.username}
              </Text>
              <Text>
                <strong>Fecha de creación de la cuenta:</strong>{" "}
                {new Date(userData.createdAt).toLocaleString()}
              </Text>
            </>
          )}
        </VStack>
      </Box>
    </Center>
  );
};

export default Perfil;
