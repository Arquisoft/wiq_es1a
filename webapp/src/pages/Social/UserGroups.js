import React, { useState, useEffect } from "react";
import {
  Alert,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Box
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserGroups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = () => {
    fetch(`${apiEndpoint}/group/list`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          const userGroups = data.groups.filter((group) =>
            group.members.includes(username)
          );
          setGroups(userGroups);
        } else {
          setError("Error fetching data: Invalid response format");
        }
      })
      .catch((error) => {
        setError("Error fetching data: " + error.message);
      });
  };

  const seeGroupDetails = (groupName) => {
    navigate(`/social/grupo/${encodeURIComponent(groupName)}`);
  };

  return (
    <>
      <Nav />
      <Flex maxW="xs" mt="5" flexDirection={"column"} alignItems={"center"}>
          <Text fontSize="3xl" fontWeight="bold" mb="4">
            {t("pages.usergroups.title")}
          </Text>
          {error && (
            <Alert status="error" variant="subtle" mt="2">
              {`Error: ${error}`}
            </Alert>
          )}
          <Box overflowX={{ base: "scroll", lg: "auto" }} width={'100%'}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t("pages.groupsTable.groupName")}</Th>
                <Th>{t("pages.groupsTable.creationDate")}</Th>
                <Th>{t("pages.groupsTable.creator")}</Th>
                <Th>{t("pages.usergroups.seegroup")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groups.map((group) => (
                <Tr key={group._id}>
                  <Td>{group.name}</Td>
                  <Td>{new Date(group.createdAt).toLocaleDateString()}</Td>
                  <Td>{group.members.length > 0 ? group.members[0] : ""}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => seeGroupDetails(group.name)}
                    >
                      {t("pages.usergroups.seegroup")}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          </Box>
      </Flex>
      <Footer />
    </>
  );
};

export default UserGroups;
