import {
  Box,
  VStack,
  Heading,
  Text,
  Center,
  Spinner,
  Avatar,
  Grid,
  Button,
  Flex,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";

const History = () => {
  const gatewayUrl =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const [error, setError] = useState(null);
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === "dark";
  const { t } = useTranslation();

  useEffect(() => {
    fetch(gatewayUrl + `/userInfo/${username}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message || "Ha ocurrido un error al obtener el perfil");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Nav />
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : error ? (
        <Center>
          <Heading>{t("pages.history.error")}</Heading>
        </Center>
      ) : (
        <Center py={8} maxWidth={"90%"}>
          <Box
            w="xl"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            width="100%"
          >
            <VStack p={8} align="center" spacing={6}>
              <Heading as="h1" size="lg">
                {t("components.profile.profile")}
              </Heading>
              <Avatar name={userData.username} />
              <Text justifyContent={"center"}>
                <strong>{t("pages.history.name")}</strong> {userData.username}
              </Text>
              <Text>
                <strong>{t("pages.history.dateLabel")}</strong>{" "}
                {new Date(userData.createdAt).toLocaleString()}
              </Text>
              <Heading as="h2" size="md">
                {t("pages.history.title")}
              </Heading>
              {userData.games &&
                userData.games.map((game, index) => (
                  <Box
                    p={6}
                    borderWidth="1px"
                    width={{ base: "90%", lg: "50%" }}
                    borderRadius="lg"
                    boxShadow="lg"
                  >
                    <Heading>
                      {t("pages.history.ngame")} {game._id}
                    </Heading>
                    <Divider margin={"1rem 0"} /> 
                    <Flex overflowX={"scroll"} scrollSnapType={"x mandatory"}>
                      {game.questions.map((question, index) => (
                        <Box scrollSnapAlign={"start"} minWidth={"100%"} p={"1rem"}>
                          <Heading as="h2" mb={4}>
                            {t("pages.wisebattery.question")} {index + 1}
                          </Heading>
                          <p>{question.pregunta}</p>
                          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
                            {question.respuestas.map((respuesta, index) => (
                              <Button
                                whiteSpace={"normal"}
                                padding={"1rem"}
                                height={"fit-content"}
                                minHeight={"3rem"}
                                bgColor={respuesta === question.correcta ? "green.500" : respuesta === question.respuesta? "red.500" : isDarkTheme ? "whiteAlpha-200" : "gray-100" }
                                disabled
                              >
                                {respuesta}
                              </Button>
                            ))}
                          </Grid>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                ))}
            </VStack>
          </Box>
        </Center>
      )}
      <Footer />
    </>
  );
};

export default History;
