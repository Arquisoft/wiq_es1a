import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  AlertIcon,
  Link,
  useColorMode,
  Flex,
  Spacer,
  Switch
} from "@chakra-ui/react";
import Footer from "../Footer/Footer";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const AddUser = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleRegister = () => {
    if (password !== passwordR) {
      setError("Las contraseñas no coinciden");
      return;
    }
    axios
      .post(`${apiEndpoint}/adduser`, { username, password })
      .then(() => setOpenSnackbar(true))
      .catch((error) => setError(err.response.data.error));
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mt={4} w="100%">
        <Box pr={5}>
          
        </Box>
        <Heading pl={6} as="h1" size="xl" color="teal.500">
          WIQ
        </Heading>
        <Box pr={5}>
          <Switch isChecked={isDarkTheme} onChange={toggleColorMode} />
        </Box>
      </Flex>
      <Box
        maxW="md"
        mx="auto"
        mt={8}
        p={6}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Heading as="h1" size="xl" mb={4}>
          Regístrate
        </Heading>
        <FormControl>
          <FormLabel htmlFor="register-username">
            Introduce tu nombre:
          </FormLabel>
          <Input
            id="register-username"
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="register-password">
            Introduce tu contraseña:
          </FormLabel>
          <Input
            id="register-password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="register-pass2">
            Vuelve a introducir la contraseña:
          </FormLabel>
          <Input
            id="register-pass2"
            type="password"
            placeholder="Repetir contraseña"
            value={passwordR}
            onChange={(e) => setPasswordR(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleRegister}>
          Registrarse
        </Button>
        <Box mt={4}>
          ¿Ya tienes cuenta?{" "}
          <Link color="teal.500" href="/login">
            Inicia sesión
          </Link>
        </Box>
        {openSnackbar && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            Usuario registrado exitosamente
          </Alert>
        )}
        {error && (
          <Alert status="error" mt={4}>
            <AlertIcon />
            Error: {error}
          </Alert>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default AddUser;
