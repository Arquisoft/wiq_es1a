import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Box,
  Flex,
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const gatewayUrl =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const { t } = useTranslation();
  const [username, setUsername] = useState(localStorage.username);
  const [stats, setStats] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchStats = (mode) => {
    setIsLoading(true);
    fetch(gatewayUrl + `/stats?username=${username}&gamemode=${mode}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setStats(null);
        } else {
          setStats(data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!fetched) {
      fetchStats(gamemode);
      setFetched(true);
    }
    // eslint-disable-next-line
  }, [username, gamemode]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleGamemodeChange = async (mode) => {
    if (mode === gamemode) return;

    setGamemode(mode);
    fetchStats(mode);
  };

  const handleSearch = () => {
    fetchStats(gamemode);
  };

  const getModeName = () => {
    if(gamemode === "clasico"){
      return t('pages.ranking.classic');    
    } else if(gamemode === "bateria"){
      return t('pages.ranking.wisebattery');
    } else if(gamemode === "calculadora"){
      return t('pages.ranking.humancalculator');
    }
    return gamemode;
  };

  if (isLoading) {
    return (
      <>
        <Nav />
        <Box>
          <Heading as="h2">{t("pages.stats.loading")}</Heading>
          <p>{t("pages.stats.loadingText")}</p>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Box maxWidth={"90%"}>
        <label htmlFor="usernameInput">
          {" "}
          <strong>{t("pages.stats.username")} </strong>
        </label>
        <Flex columnGap="1rem" justifyContent="space-between">
          <Input
            width="85%"
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <Button onClick={handleSearch}>{t("pages.stats.search")}</Button>
        </Flex>
        <Flex
          rowGap="0.5rem"
          justifyContent="center"
          m="0.5rem 0"
          flexDirection="column"
        >
          <Button
            className={gamemode === "clasico" ? "active" : ""}
            onClick={() => handleGamemodeChange("clasico")}
          >
            {t("pages.stats.classic")}
          </Button>
          <Button
            className={gamemode === "bateria" ? "active" : ""}
            onClick={() => handleGamemodeChange("bateria")}
          >
            {t("pages.stats.wisebattery")}
          </Button>
          <Button
            data-testid="calculator-button"
            className={gamemode === "calculadora" ? "active" : ""}
            onClick={() => handleGamemodeChange("calculadora")}
          >
            {t("pages.stats.humancalculator")}
          </Button>
        </Flex>
        {stats === null && !isLoading && (
          <p mt="10rem">{t("pages.stats.noStats")}</p>
        )}
        {stats && (
          <div>
            <Heading as="h2">
              {t("pages.stats.stats")} {stats.username} -{" "}
              {t("pages.stats.mode")} {getModeName()}
            </Heading>
            <Table>
              <Tbody>
                <Tr>
                  <Td>
                    <strong>{t("pages.stats.gamesPlayed")}</strong>
                  </Td>
                  <Td>{stats.nGamesPlayed}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>{t("pages.stats.pointsPerGame")}</strong>
                  </Td>
                  <Td>{stats.avgPoints && stats.avgPoints.toFixed(2)}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>{t("pages.stats.totalpoints")}</strong>
                  </Td>
                  <Td>{stats.totalPoints}</Td>
                </Tr>
                {gamemode !== "calculadora" && (
                  <>
                    <Tr>
                      <Td>
                        <strong>{t("pages.stats.totalCorrect")}</strong>
                      </Td>
                      <Td>{stats.totalCorrectQuestions}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <strong>{t("pages.stats.totalIncorrect")}</strong>
                      </Td>
                      <Td>{stats.totalIncorrectQuestions}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <strong>{t("pages.stats.correctRatio")}</strong>
                      </Td>
                      <Td>{stats.ratioCorrect.toFixed(2)}%</Td>
                    </Tr>
                  </>
                )}
                <Tr>
                  <Td>
                    <strong>{t("pages.stats.avgTime")}</strong>
                  </Td>
                  <Td>{stats.avgTime.toFixed(2)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </div>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Stats;
