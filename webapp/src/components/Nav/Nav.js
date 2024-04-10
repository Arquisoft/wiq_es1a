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
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
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

  const currentLocation = window.location;
  const otherPortUrl = `${currentLocation.protocol}//${currentLocation.hostname}:8000/api-doc`;

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
      flexDirection={{base:"column", lg: "row"}}
    >
      <Heading width={"25%"} as="h1" size="xl" color={textColor} ml={3} textAlign={{base:"center", lg: "start"}}>
        WIQ
      </Heading>
      <Flex gap={3} flexDirection={{base:"column", lg: "row"}}>
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
        <Menu>
          <MenuButton>
            <Flex
              _hover={{ backgroundColor: "gray.400", color: "white" }}
              p={4}
              alignItems={"center"}
              gap={"1rem"}
            >
              <Text alignItems="center">{username}</Text>
              <Avatar name={username} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title={t("components.nav.profile")}>
              <MenuItem onClick={() => handleNavigate("/perfil")}>{t("components.nav.myprofile")}</MenuItem>
              <MenuItem onClick={() => handleNavigate("/config")}>{t("components.nav.options")}</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Ayuda">
              <MenuItem><a href={otherPortUrl}>{t("components.nav.api")}</a></MenuItem>
              <MenuItem onClick={() => handleNavigate("/sobre")}>{t("components.nav.about")}</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
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
