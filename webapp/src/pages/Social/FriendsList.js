import React, { useState, useEffect } from "react";
import {
  Container,
  Text,
  List,
  ListItem,
  Divider,
  Heading,
  Button,
  Avatar,
  Flex
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import Profile from "../../components/Profile/Profile.js";
import { useTranslation } from "react-i18next";

const FriendList = () => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState("");
  const [friendReload, setFriendReload] = useState(false);
  const currentUser = localStorage.getItem("username");
  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const fetchFriends = async () => {
    const username = localStorage.getItem("username");
    setIsLoading(true);
    fetch(`${apiEndpoint}/friends?user=${username}`)
      .then((response) => {
        if (!response.status === 200) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFriends(data.friends);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los amigos:", error);
        setIsLoading(false);
      });
  };

  const handleRemoveFriend = async (friend) => {
    try {
      // Realizar la solicitud HTTP POST al endpoint '/users/remove-friend'
      const response = await fetch(apiEndpoint + "/users/remove-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser, // Nombre de usuario del usuario actual
          friendUsername: friend, // Nombre de usuario del amigo que se está eliminando
        }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar amigo");
      }
      setFriendReload(!friendReload);
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    // eslint-disable-next-line
  }, [friendReload]);

  if (isLoading) {
    return (
      <div>
        <Heading as="h2">{t('pages.friendlist.loading')}</Heading>
        <p>{t('pages.friendlist.loadingText')}</p>
      </div>
    );
  }

  return (
    <>
      <Nav />
      {friend ? (
        <>
          <Profile username={friend} />
          <Button onClick={() => setFriend("")}>{t('pages.friendlist.back')}</Button>
        </>
      ) : (
        <Container maxW="md">
          <Heading as="h1" size="xl" margin="1rem">
            {t('pages.friendlist.list')}
          </Heading>
          {friends && friends.length > 0 ? (
            <List display="flex" flexDirection="column" spacing={3}>
              {friends.map((friend, index) => (
                <div key={friend._id}>
                  <ListItem
                    m="1rem"
                    display="flex"
                    justifyContent="space-around"
                  >
                    <Flex flexDirection="column" alignItems="center">
                      <Avatar name={friend} />
                      <Text>{friend}</Text>
                    </Flex>
                    <Button onClick={() => setFriend(friend)}>
                      {t('pages.friendlist.profile')}
                    </Button>
                    <Button onClick={() => handleRemoveFriend(friend)}>
                      {t('pages.friendlist.delete')}</Button>
                  </ListItem>
                  {index !== friends.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          ) : (
            <Text fontSize="xl" textAlign="center">
              {t('pages.friendlist.noFriends')}
            </Text>
          )}
        </Container>
      )}
      <Footer />
    </>
  );
};

export default FriendList;
