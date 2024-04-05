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
  Flex
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const { t } = useTranslation();

  const [username, setUsername] = useState(localStorage.username || "error");
  const [stats, setStats] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchStats = (mode) => {
    setIsLoading(true);
    fetch(gatewayUrl + `/stats?user=${username}&gamemode=${mode}`)
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las estadísticas:", error);
        setError(
          error.message || "Ha ocurrido un error al obtener las estadísticas"
        );
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
    if (gamemode === "clasico") {
      return "Clásico";
    } else if (gamemode === "bateria") {
      return "Batería de sabios";
    } else if (gamemode === "calculadora") {
      return "Calculadora humana";
    }
    return gamemode;
  };

  if (isLoading) {
    return (
      <div>
        <Heading as="h2">{t('pages.stats.loading')}</Heading>
        <p>{t('pages.stats.loadingText')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <Box>
          <label htmlFor="usernameInput">{t('pages.stats.username')}</label>
          <Input
            type="text"
            id="usernameInput"
            value={username}
            onChange={handleUsernameChange}
            data-testid="usernameInput"
          />
          <Button onClick={handleSearch}>{t('pages.stats.search')}</Button>
          <Heading as="h2">Error: {error}</Heading>
          <p marginTop="1rem">
            {t('pages.stats.searchText')}
          </p>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <Box>
        <label htmlFor="usernameInput">
          {" "}
          <strong>{t('pages.stats.username')} </strong>
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
          <Button onClick={handleSearch}>{t('pages.stats.search')}</Button>
        </Flex>
        <Flex rowGap="0.5rem" justifyContent="center" m="0.5rem 0" flexDirection="column">
          <Button
            className={gamemode === "clasico" ? "active" : ""}
            onClick={() => handleGamemodeChange("clasico")}
          >
            {t('pages.stats.classic')}
          </Button>
          <Button
            className={gamemode === "bateria" ? "active" : ""}
            onClick={() => handleGamemodeChange("bateria")}
          >
            {t('pages.stats.wisebattery')}
          </Button>
          <Button
            className={gamemode === "calculadora" ? "active" : ""}
            onClick={() => handleGamemodeChange("calculadora")}
          >
            {t('pages.stats.humancalculator')}
          </Button>
        </Flex>
        {stats === null && !isLoading && (
          <p mt="10rem">{t('pages.stats.noStats')}</p>
        )}
        {stats && (
          <div>
            <Heading as="h2">
              {t('pages.stats.stats')} {stats.username} - {t('pages.stats.mode')} {getModeName()}
            </Heading>
            <Table>
              <Tbody>
                <Tr>
                  <Td>
                    <strong>{t('pages.stats.gamesPlayed')}</strong>
                  </Td>
                  <Td>{stats.nGamesPlayed}</Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>{t('pages.stats.pointsPerGame')}</strong>
                  </Td>
                  <Td>{stats.avgPoints.toFixed(2)}</Td>
                </Tr>
                    <Tr>
                      <Td>
                        <strong>{t('pages.stats.totalpoints')}</strong>
                      </Td>
                      <Td>{stats.totalPoints}</Td>
                    </Tr>
                  {gamemode !== "calculadora" && (
                  <>
                    <Tr>
                      <Td>
                        <strong>{t('pages.stats.totalCorrect')}</strong>
                      </Td>
                      <Td>{stats.totalCorrectQuestions}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <strong>{t('pages.stats.totalIncorrect')}</strong>
                      </Td>
                      <Td>{stats.totalIncorrectQuestions}</Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <strong>{t('pages.stats.correctRatio')}</strong>
                      </Td>
                      <Td>{stats.ratioCorrect.toFixed(2)}%</Td>
                    </Tr>
                    </>
                  )}
                    <Tr>
                      <Td>
                        <strong>{t('pages.stats.avgTime')}</strong>
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

