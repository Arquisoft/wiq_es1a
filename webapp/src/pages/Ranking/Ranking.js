import React, { useState, useEffect } from "react";
import { Select, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, Flex } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next"; 

const Ranking = () => {
  const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const { t } = useTranslation();

  const [ranking, setRanking] = useState([]);
  const [filterBy, setFilterBy] = useState("avgPoints");
  const [displayOptions] = useState([
    { value: "avgPoints", label: `${t('pages.ranking.avgPoints')}` },
    { value: "totalPoints", label: `${t('pages.ranking.totalPoints')}` },
    { value: "ratioCorrect", label: `${t('pages.ranking.ratioCorrect')}` },
    { value: "avgTime", label: `${t('pages.ranking.avgTime')}` },
    { value: "avgPoints", label: `${t('pages.ranking.reboot')}` },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gamemode, setGamemode] = useState("clasico");

  const fetchRanking = () => {
    setIsLoading(true);
    fetch(gatewayUrl + `/ranking?gamemode=${gamemode}&filterBy=${filterBy}`)
      .then((response) => response.json())
      .then((data) => {
        setRanking(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message || `${t('pages.ranking.errorText')}`);
        setIsLoading(false);
      });
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

  useEffect(() => {
    fetchRanking();
    // eslint-disable-next-line
  }, [gamemode, filterBy]);

  const handleDisplayChange = (event) => {
    setFilterBy(event.target.value);
  };

  const getDisplayedField = () => {
    switch (filterBy) {
      case "avgPoints":
        return `${t('pages.ranking.avgPoints')}`;
      case "totalPoints":
        return `${t('pages.ranking.totalPoints')}`;
      case "ratioCorrect":
        if (gamemode === "calculadora") return null;
        return `${t('pages.ranking.ratioCorrect')}`;
      case "avgTime":
        return `${t('pages.ranking.avgTime')}`;
      default:
        return "";
    }
  };

  const getDisplayValue = (stat) => {
    switch (filterBy) {
      case "avgPoints":
        return Math.round(stat.avgPoints * 100) / 100;
      case "totalPoints":
        return stat.totalPoints;
      case "ratioCorrect":
        if (gamemode === "calculadora") return null;
        return Math.round(stat.ratioCorrect * 100) / 100;
      case "avgTime":
        return Math.round(stat.avgTime * 100) / 100;
      default:
        return "";
    }
  };

  const handleGamemodeChange = (mode) => {
    setGamemode(mode);
    fetchRanking();
  };

  if (isLoading) {
    return (
      <>
    <Nav/>
      <div>
        <Heading as="h2">{t('pages.ranking.loading')}</Heading>
        <p>{t('pages.ranking.loadingText')}</p>
      </div>
      <Footer/>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav/>
        <div>
          <Heading as="h2">{t('pages.ranking.errorText')}</Heading>
          <p>{error}</p>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
    <Nav/>
    <Flex maxWidth={"90%"} flexDirection="column" rowGap="1rem">
      <Heading as="h2">{t('pages.ranking.rank-mode')} {getModeName()}</Heading>
      <Select width={"100%"} maxWidth={"90%"} id="displaySelector" data-testid="combobox" onChange={handleDisplayChange}>
        {displayOptions.map(option => {
          if (gamemode === "calculadora" && option.value === "ratioCorrect") {
            return null;
          }
          return <option value={option.value}>{option.label}</option>;
        })}
      </Select>
      <Button
        className={gamemode === "clasico" ? "active" : ""}
        onClick={() => handleGamemodeChange("clasico")}
        data-testid="classic-button"
      >
      {t('pages.ranking.classic')}
      </Button>
      <Button
        className={gamemode === "bateria" ? "active" : ""}
        onClick={() => handleGamemodeChange("bateria")}
        data-testid="battery-button"
      >
        {t('pages.ranking.wisebattery')}
      </Button>
      <Button
        className={gamemode === "calculadora" ? "active" : ""}
        onClick={() => handleGamemodeChange("calculadora")}
        data-testid="calculator-button"
      >
        {t('pages.ranking.humancalculator')}
      </Button>
      {ranking && ranking.length>0 ? (
        <>
        <Table>
        <Thead>
          <Tr>
            <Th>{t('pages.ranking.user')}</Th>
            <Th>{getDisplayedField()}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ranking && ranking.map((stat, index) => (
            <Tr key={index}>
              <Td>{stat.username}</Td>
              <Td>{getDisplayValue(stat)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </>
      ): 
      <>
      <div>
        <Heading as="h2">{t('pages.ranking.errorText')}</Heading>
        <p>{t('pages.ranking.noStats')}</p>
      </div>
      </>}
      
    </Flex>
    <Footer/>
    </>
  );
};

export default Ranking;



