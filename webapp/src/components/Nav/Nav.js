import React from "react";
import { Box, Button, Heading, Switch, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Text, Flex, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const textColor = isDarkTheme ? "white" : "teal.500";
  const bgColor = isDarkTheme ? 'gray.700' : 'gray.200';
  
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
    <Box as="nav" display="flex" alignItems="center" justifyContent="space-between" p={4} bg={bgColor} width="100%">
      <Box textAlign="center" ml={3} width="25%" justifyContent="start">
        <Heading as="h1" size="xl" color={textColor} textAlign="start">WIQ</Heading>
      </Box>
      <Flex gap={3}>
        <Button variant="link" color={textColor} mr={4} p={2} _hover={{ backgroundColor: 'gray.400', color: 'white' }} onClick={() => handleNavigate("/home")}>Home</Button>
        <Popover>
          <PopoverTrigger>
            <Button p={2} _hover={{ backgroundColor: 'gray.400', color: 'white' }} p={4} variant="link" color={textColor}>
              Modos de Juego
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader >Modos de Juego</PopoverHeader>
            <PopoverBody>
              <Text cursor="pointer" onClick={() => handleNavigate("/home/clasico")} color={textColor}>Clásico</Text>
              <Text cursor="pointer" onClick={() => handleNavigate("/home/bateria")} color={textColor}>Batería de sabios</Text>
              {/* Agrega más modos de juego aquí */}
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button variant="link" _hover={{ backgroundColor: 'gray.400', color: 'white' }} p={4} color={textColor}>
              Social
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Social</PopoverHeader>
            <PopoverBody>
              <Text cursor="pointer" onClick={() => handleNavigate("/social/usuarios")} color={textColor}>Usuarios</Text>
              <Text cursor="pointer" onClick={() => handleNavigate("/social/amigos")} color={textColor}>Amigos</Text>
              <Text cursor="pointer" onClick={() => handleNavigate("/social/grupos")} color={textColor}>Grupos</Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Button variant="link" _hover={{ backgroundColor: 'gray.400', color: 'white' }} p={4} color={textColor} mr={4} onClick={() => handleNavigate("/stats")}>Estadísticas</Button>
        <Button variant="link" _hover={{ backgroundColor: 'gray.400', color: 'white' }} p={4} color={textColor} mr={4} onClick={() => handleNavigate("/ranking")}>Ranking</Button>
        <Button variant="link" _hover={{ backgroundColor: 'gray.400', color: 'white' }} p={4} color={textColor} mr={4} onClick={() => handleNavigate("/perfil")}>Perfil</Button>
      </Flex>
      <Flex width="25%"  className="rightItems" justifyContent="end">
        <Button variant="link" color={textColor} mr={4} p={2} _hover={{ backgroundColor: 'gray.400', color: 'white' }} onClick={() => handleNavigate("/sobre")}>Sobre nosotros</Button>
        <Button variant="link" color={textColor} mr={4} p={2} _hover={{ backgroundColor: 'gray.400', color: 'white' }} onClick={() => handleConfig()}>Opciones</Button>
        <Button variant="link" color={textColor} p={2} _hover={{ backgroundColor: 'gray.400', color: 'white' }} onClick={() => logout()}>Desconectarse</Button>
        <Switch isChecked={isDarkTheme} onChange={toggleColorMode} ml={4} alignSelf="center"/>
      </Flex>
    </Box>
  );
};

export default Nav;
