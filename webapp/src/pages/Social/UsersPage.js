import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Text,
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const UserList = ({ users, handleAddFriend }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Heading mt={"1.5rem"} as="h2">{t("pages.userspage.list")}</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign="center">{t("pages.userspage.user")}</Th>
            <Th>{t("pages.userspage.actions")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>
                <Flex flexDirection="column" alignItems="center">
                  <Avatar name={user.username} />
                  <Text>{user.username}</Text>
                </Flex>
              </Td>
              <Td>
                {user.isFriend ? (
                  <span>{t("pages.userspage.friend")}</span>
                ) : (
                  <Button onClick={() => handleAddFriend(user)}>
                    {t("pages.userspage.addFriend")}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

const UsersPage = () => {
  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = localStorage.getItem("username");

  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    fetch(`${apiEndpoint}/users/search?username=${currentUser}`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(
          error.message || "Ha ocurrido un error al obtener los usuarios"
        );
        setIsLoading(false);
      });
  };

  const handleAddFriend = async (user) => {
    try {
      // Realizar la solicitud HTTP POST al endpoint '/users/add-friend'
      const response = await fetch(apiEndpoint + "/users/add-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser, // Nombre de usuario del usuario actual
          friendUsername: user.username, // Nombre de usuario del amigo que se está agregando
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar amigo");
      }

      // Agregar el usuario a la lista de amigos localmente
      setUsers((prevFriends) => [...prevFriends, user]);
      // Actualizar el estado de isFriend del usuario
      setUsers((prevUsers) => {
        return prevUsers.map((u) => {
          if (u._id === user._id) {
            return { ...u, isFriend: true };
          }
          return u;
        });
      });
    } catch (error) {
      console.error("Error al agregar amigo:", error);
      // Manejar el error según sea necesario
    }
  };

  return (
    <>
      <Nav />
      <div>
        {isLoading && <p>{t("pages.userspage.loading")}</p>}
        {error && (
          <p>
            {t("pages.userspage.error")} {error}
          </p>
        )}
        <UserList users={users} handleAddFriend={handleAddFriend} />
      </div>
      <Footer />
    </>
  );
};

export default UsersPage;
