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
  Switch
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import { useTranslation } from "react-i18next";

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const AddUser = () => {
  const { t } = useTranslation();

  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleRegister = () => {
    if (password !== passwordR) {
      setError(t('components.register.registerError'));
      return;
    }
    axios
      .post(`${apiEndpoint}/adduser`, { username, password })

      .then((response) => {
        const { token } = response.data;
        setOpenSnackbar(true);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        navigate("/home");
      })
      .catch((err) => setError(err.response.data.error));

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
          {t('components.register.title')}
        </Heading>
        <FormControl>
          <FormLabel htmlFor="register-username">
            {t('components.register.nameLabel')}
          </FormLabel>
          <Input
            id="register-username"
            name="username"
            type="text"
            placeholder={t('components.register.namePlaceholder')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="register-password">
          {t('components.register.passwordLabel')}
          </FormLabel>
          <Input
            id="register-password"
            name="password"
            type="password"
            placeholder={t('components.register.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel htmlFor="register-pass2">
          {t('components.register.password2Label')}
          </FormLabel>
          <Input
            id="register-pass2"
            type="password"
            placeholder={t('components.register.passwordPlaceholder')}
            value={passwordR}
            onChange={(e) => setPasswordR(e.target.value)}
          />
        </FormControl>
        <Button mt={4} colorScheme="blue" onClick={handleRegister}>
          {t('components.register.registerButton')}
        </Button>
        <Box mt={4}>
          {t('components.register.loginText')}{" "}
          <Link color="teal.500" href="/login">
            {t('components.register.loginLink')}
          </Link>
        </Box>
        {openSnackbar && (
          <Alert status="success" mt={4}>
            <AlertIcon />
            {t('components.register.registerAlert')}
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
