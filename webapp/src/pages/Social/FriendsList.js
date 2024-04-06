import React, { useState, useEffect } from "react";
import {
  Container,
  Text,
  List,
  ListItem,
  Divider,
  Heading,
  Button,
  Avatar
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import Profile from "../../components/Profile/Profile.js";

const FriendList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friend, setFriend] = useState("");
  const apiEndpoint =
    process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

  const fetchFriends = async () => {
    const username = localStorage.getItem("username");
    setIsLoading(true);
    fetch(`${apiEndpoint}/friends?user=${username}`)
      .then((response) => response.json())
      .then((data) => {
        setFriends(data.friends);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los amigos:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (isLoading) {
    return (
      <div>
        <Heading as="h2"> Cargando ... </Heading>
        <p>Se está consultando su búsqueda, espere unos instantes.</p>
      </div>
    );
  }

  return (
    <>
      <Nav />
      {friend ? (
        <>
          <Profile username={friend} />
          <Button onClick={() => setFriend("")}>Volver</Button>
        </>
      ) : (
        <Container maxW="md">
          <Heading as="h1" size="xl" margin="1rem">
            Lista de amigos
          </Heading>
          {friends.length > 0 ? (
            <List display="flex" flexDirection="column" gap="1rem" spacing={3}>
              {friends.map((friend, index) => (
                <div key={friend._id}>
                  <ListItem display="flex" justifyContent="space-around">
                    <Avatar name={friend} />
                    <Text alignSelf="center">{friend}</Text>
                    <Button onClick={() => setFriend(friend)}>Ver perfil</Button>
                  </ListItem>
                  {index !== friends.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          ) : (
            <Text fontSize="xl" textAlign="center">
              No tienes amigos actualmente.
            </Text>
          )}
        </Container>
      )}
      <Footer />
    </>
  );
};

export default FriendList;
