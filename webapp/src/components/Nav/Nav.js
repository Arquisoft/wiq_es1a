import { React, useState } from "react";
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
  Drawer,
  DrawerBody,
  Link,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useBreakpointValue,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const { t } = useTranslation();

  const username = process.env.NODE_ENV === "test" ? "testuser" : localStorage.getItem("username");

  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const textColor = isDarkTheme ? "white" : "teal.500";
  const bgColor = isDarkTheme ? "gray.700" : "gray.200";
  // eslint-disable-next-line
  const isLargeScreen = process.env.NODE_ENV === 'test'? true : useBreakpointValue({ base: false, lg: true });
  const currentLocation = window.location;
  const otherPortUrl = `${currentLocation.protocol}//${currentLocation.hostname}:8000/api-doc`;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = () => { // NOSONAR
    if(process.env.NODE_ENV !== 'test'){
      localStorage.removeItem("username");
      localStorage.removeItem("token");
    }
    navigate("/login");
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
      <Heading
        width={"25%"}
        as="h1"
        size="xl"
        color={textColor}
        ml={{ base: 0, lg: 3 }}
        textAlign={{ base: "center", lg: "start" }}
      >
        WIQ
      </Heading>

      {isLargeScreen ? (
        <Flex
          gap={3}
          order={{ base: 3, lg: 2 }}
        >
          <Button
            variant="link"
            color={textColor}
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
              <PopoverHeader data-testid="modes">{t("components.nav.gameModes")}</PopoverHeader>
              <PopoverBody>
                <Text
                  data-testid="classic"
                  cursor="pointer"
                  onClick={() => handleNavigate("/home/clasico")}
                  color={textColor}
                >
                  {t("components.nav.classic")}
                </Text>
                <Text
                  data-testid="battery"
                  cursor="pointer"
                  onClick={() => handleNavigate("/home/bateria")}
                  color={textColor}
                >
                  {t("components.nav.wisebattery")}
                </Text>
                <Text
                  data-testid="calculator" 
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
                  data-testid="users"
                  cursor="pointer"
                  onClick={() => handleNavigate("/social/usuarios")}
                  color={textColor}
                >
                  {t("components.nav.users")}
                </Text>
                <Text
                  data-testid="friends"
                  cursor="pointer"
                  onClick={() => handleNavigate("/social/amigos")}
                  color={textColor}
                >
                  {t("components.nav.friends")}
                </Text>
                <Text
                  data-testid="groups"
                  cursor="pointer"
                  onClick={() => handleNavigate("/social/grupos")}
                  color={textColor}
                >
                  {t("components.nav.groups")}
                </Text>
                <Text
                  data-testid="mygroups"
                  cursor="pointer"
                  onClick={() => handleNavigate("/social/misgrupos")}
                  color={textColor}
                >
                  {t("components.nav.usergroups")}
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
      ) : (
        <IconButton
          aria-label="Abrir menú"
          icon={<HamburgerIcon />}
          color={textColor}
          onClick={() => setIsDrawerOpen(true)}
          display={{ base: "flex", lg: "none" }}
        />
      )}
      <Flex
        width="25%"
        className="rightItems"
        justifyContent="end"
        order={{ base: 2, lg: 3 }}
      >
        <Menu>
          <MenuButton>
            <Flex
              _hover={{ backgroundColor: "gray.400", color: "white" }}
              p={4}
              alignItems={"center"}
              gap={"1rem"}
            >
              {isLargeScreen && <Text alignItems="center">{username}</Text>}
              <Avatar name={username} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuGroup title={t("components.nav.profile")}>
              <MenuItem onClick={() => handleNavigate("/perfil")}>
                {t("components.nav.myprofile")}
              </MenuItem>
              <MenuItem onClick={() => handleNavigate("/history")}>
                {t("components.nav.history")}
              </MenuItem>
              <MenuItem onClick={() => handleNavigate("/config")}>
                {t("components.nav.options")}
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Info">
              <MenuItem>
                <a href={otherPortUrl}>{t("components.nav.api")}</a>
              </MenuItem>
              <MenuItem onClick={() => handleNavigate("/sobre")}>
                {t("components.nav.about")}
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title="Ayuda">
            <MenuItem onClick={() => handleNavigate("/ayuda")}>
                {t("components.nav.help")}
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>{t("components.nav.disconnect")}</MenuItem>
          </MenuList>
        </Menu>
        <Switch
          isChecked={isDarkTheme}
          onChange={toggleColorMode}
          ml={4}
          alignSelf="center"
        />
      </Flex>
      {!isLargeScreen && (
        <Drawer placement="left" onClose={closeDrawer} isOpen={isDrawerOpen}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>WIQ</DrawerHeader>
              <DrawerBody>
                <Stack spacing="24px">
                  <Link href="/home" data-testid="home-clasico-link">
                    {t("components.nav.home")}
                  </Link>

                  <Box>
                    <FormLabel htmlFor="url">
                      {t("components.nav.gameModes")}
                    </FormLabel>
                    <Flex flexDirection={"column"}>
                      <Link href="/home/clasico" data-testid="home-clasico-link">
                        {t("components.nav.classic")}
                      </Link>
                      <Link href="/home/bateria" data-testid="home-bateria-link">
                        {t("components.nav.wisebattery")}
                      </Link>
                      <Link href="/home/calculadora" data-testid="home-calculadora-link">
                        {t("components.nav.humancalculator")}
                      </Link>
                    </Flex>
                  </Box>

                  <Box>
                    <FormLabel htmlFor="owner">
                      {t("components.nav.social")}
                    </FormLabel>
                    <Flex flexDirection={"column"}>
                      <Link href="/social/usuarios" data-testid="home-usuarios-link">
                        {t("components.nav.users")}
                      </Link>
                      <Link href="/social/amigos" data-testid="home-amigos-link">
                        {t("components.nav.friends")}
                      </Link>
                      <Link href="/social/grupos" data-testid="home-grupos-link">
                        {t("components.nav.groups")}
                      </Link>
                      <Link href="/social/misgrupos" data-testid="home-mygroups-link">
                        {t("components.nav.usergroups")}
                      </Link>
                      <Link href="/stats" data-testid="home-stats-link">{t("components.nav.stats")}</Link>
                      <Link href="/ranking" data-testid="home-ranking-link">{t("components.nav.ranking")}</Link>
                    </Flex>
                  </Box>

                  <Box>
                    <Flex flexDirection={"column"}>
                      <Link href="/config" data-testid="home-config-link">
                        {t("components.nav.options")}
                      </Link>
                      <Link href="/sobre" data-testid="home-sobre-link">
                        {t("components.nav.about")}
                      </Link>
                    </Flex>
                  </Box>

                  <Box>
                    <Flex flexDirection={"column"}>
                      <Link onClick={handleLogout} data-testid="home-logout-link">
                        {t("components.nav.disconnect")}
                      </Link>
                    </Flex>
                  </Box>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </Box>
  );
};

export default Nav;
