import { React } from "react";
import {
  Box,
  Button,
  Heading,
  Switch,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
  Flex,
  useColorMode,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t } = useTranslation();

  const username = localStorage.getItem("username");
 
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const textColor = isDarkTheme ? "white" : "teal.500";
  const bgColor = isDarkTheme ? "gray.700" : "gray.200";

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
    <Box
      as="nav"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={4}
      bg={bgColor}
      width="100%"
    >
      <Box textAlign="center" ml={3} width="25%" justifyContent="start">
        <Heading as="h1" size="xl" color={textColor} textAlign="start">
          WIQ
        </Heading>
      </Box>
      <Flex gap={3}>
        <Button
          variant="link"
          color={textColor}
          mr={4}
          p={2}
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          onClick={() => handleNavigate("/home")}
        >
          {t("components.nav.home")}
        </Button>
        <Popover>
          <PopoverTrigger>
            <Button
              p={2}
              _hover={{ backgroundColor: "gray.400", color: "white" }}
              variant="link"
              color={textColor}
            >
              {t("components.nav.gameModes")}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>{t("components.nav.gameModes")}</PopoverHeader>
            <PopoverBody>
              <Text
                cursor="pointer"
                onClick={() => handleNavigate("/home/clasico")}
                color={textColor}
              >
                {t("components.nav.classic")}
              </Text>
              <Text
                cursor="pointer"
                onClick={() => handleNavigate("/home/bateria")}
                color={textColor}
              >
                {t("components.nav.wisebattery")}
              </Text>
              <Text
                cursor="pointer"
                onClick={() => handleNavigate("/home/calculadora")}
                color={textColor}
              >
                {t("components.nav.humancalculator")}
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            <Button
              variant="link"
              _hover={{ backgroundColor: "gray.400", color: "white" }}
              p={4}
              color={textColor}
            >
              Social
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Social</PopoverHeader>
            <PopoverBody>
              <Text
                cursor="pointer"
                onClick={() => handleNavigate("/social/usuarios")}
                color={textColor}
              >
                {t("components.nav.users")}
              </Text>
              <Text
                cursor="pointer"
                onClick={() => handleNavigate("/social/amigos")}
                color={textColor}
              >
                {t("components.nav.friends")}
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Button
          variant="link"
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          p={4}
          color={textColor}
          onClick={() => handleNavigate("/stats")}
        >
          {t("components.nav.stats")}
        </Button>
        <Button
          variant="link"
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          p={4}
          color={textColor}
          onClick={() => handleNavigate("/ranking")}
        >
          Ranking
        </Button>
      </Flex>
      <Flex width="25%" className="rightItems" justifyContent="end">
        <Button
          variant="link"
          color={textColor}
          p={2}
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          onClick={() => handleNavigate("/sobre")}
        >
          {t("components.nav.about")}
        </Button>
        <Button
          variant="link"
          color={textColor}
          p={2}
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          onClick={() => handleConfig()}
        >
          {t("components.nav.options")}
        </Button>
        <Flex
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          onClick={() => handleNavigate("/perfil")}
          p={4}
          alignItems={"center"}
          gap={"1rem"}
        >
          <Text alignItems="center">{username}</Text>
          <Avatar name={username} />
        </Flex>
        <Button
          variant="link"
          color={textColor}
          p={4}
          _hover={{ backgroundColor: "gray.400", color: "white" }}
          onClick={() => logout()}
        >
          {t("components.nav.disconnect")}
        </Button>
        <Switch
          isChecked={isDarkTheme}
          onChange={toggleColorMode}
          ml={4}
          alignSelf="center"
        />
      </Flex>
    </Box>
  );
};

export default Nav;
