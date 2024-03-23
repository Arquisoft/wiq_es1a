import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Link,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  AlertIcon,
  useColorMode,
  Switch,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import Footer from "../Footer/Footer";

const Login = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const loginUser = async () => {
    try {
      const response = await axios.post(`${apiEndpoint}/login`, {
        username,
        password,
      });
      const token = response.data;

      setLoginSuccess(true);
      setOpenSnackbar(true);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mt={4}>
        <Spacer flex={0}/>
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
        {!loginSuccess && (
          <>
            <Heading as="h1" size="xl" mb={4}>
              Identifícate
            </Heading>
            <FormControl>
              <FormLabel htmlFor="login-username">
                Introduce tu nombre:
              </FormLabel>
              <Input
                id="login-username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel htmlFor="login-password">
                Introduce tu contraseña:
              </FormLabel>
              <Input
                id="login-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={loginUser}>
              Login
            </Button>
            <Box mt={4}>
              ¿No tienes cuenta?{" "}
              <Link color="teal.500" href="/register">
                Regístrate
              </Link>
            </Box>
            {openSnackbar && (
              <Alert status="success" mt={4}>
                <AlertIcon />
                Login successful
              </Alert>
            )}
            {error && (
              <Alert status="error" mt={4}>
                <AlertIcon />
                Error: {error}
              </Alert>
            )}
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Login;
