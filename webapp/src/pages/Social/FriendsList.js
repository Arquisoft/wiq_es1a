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
  const currentUser = localStorage.getItem("username");
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
  
  const handleRemoveFriend = async (user) => {
    try {
      // Realizar la solicitud HTTP POST al endpoint '/users/remove-friend'
      const response = await fetch(apiEndpoint + "/users/remove-friend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser, // Nombre de usuario del usuario actual
          friendUsername: user.username, // Nombre de usuario del amigo que se está eliminando
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al eliminar amigo");
      }
  
      // Eliminar al usuario de la lista de amigos localmente
      setFriends((prevFriends) => prevFriends.filter(friend => friend._id !== user._id));
      // Actualizar el estado de isFriend del usuario
      setFriends((prevFriends) => {
        return prevFriends.map((u) => {
          if (u._id === user._id) {
            return { ...u, isFriend: false };
          }
          return u;
        });
      });
    } catch (error) {
      console.error("Error al eliminar amigo:", error);
    }
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
            <List display="flex" flexDirection="column" spacing={3}>
              {friends.map((friend, index) => (
                <div key={friend._id}>
                  <ListItem m="1rem" display="flex" justifyContent="space-around">
                    <Avatar name={friend} />
                    <Text alignSelf="center">{friend}</Text>
                    <Button onClick={() => setFriend(friend)}>Ver perfil</Button>
                    <Button onClick={() => handleRemoveFriend(friend)}>Eliminar amigo</Button>
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
