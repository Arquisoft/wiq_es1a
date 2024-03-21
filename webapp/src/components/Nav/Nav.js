import React from "react";
import { Box, Button, Heading, Switch, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Text, Flex, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const textColor = isDarkTheme ? "white" : "teal.500";

  const handleConfig = () => {
    navigate("/config");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Box as="nav" display="flex" alignItems="center" justifyContent="space-between" p={4}>
      <Box textAlign="center" mb={8} mt={3} ml={3}>
        <Heading as="h1" size="xl" color={textColor}>WIQ</Heading>
      </Box>
      <Flex className="menuItems" mr={4}>
        <Popover>
          <PopoverTrigger>
            <Button variant="link" color={textColor}>
              Modos de Juego
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Modos de Juego</PopoverHeader>
            <PopoverBody>
              <Text cursor="pointer" onClick={() => handleNavigate("/home/clasico")} color={textColor}>Clásico</Text>
              <Text cursor="pointer" onClick={() => handleNavigate("/home/bateria")} color={textColor}>Batería de sabios</Text>
              {/* Agrega más modos de juego aquí */}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Flex className="rightItems" alignItems="center">
        <Button variant="link" color={textColor} mr={4} onClick={() => handleConfig()}>Opciones</Button>
        <Button variant="link" color={textColor} onClick={() => logout()}>Desconectarse</Button>
        <Switch isChecked={isDarkTheme} onChange={toggleColorMode} ml={4} />
      </Flex>
    </Box>
  );
};

export default Nav;
