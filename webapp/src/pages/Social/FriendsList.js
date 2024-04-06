import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Text, List, ListItem, Divider } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const fetchFriends = async () => {
        const username = localStorage.getItem('username');
        setIsLoading(true);
        fetch(gatewayUrl + `${apiEndpoint}/friends?user=${username}`)
        .then((response) => response.json())
        .then((data) => {
            setFriends(data);
            setIsLoading(false);
        })
        .catch((error) => {
            console.error("Error al obtener los amigos:", error);
            setError(
            error.message || "Ha ocurrido un error al obtener los amigos"
            );
            setIsLoading(false);
        });
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    return (
        <>
        <Nav/>
        <Container maxW="md">
            <Text fontSize="3xl" textAlign="center" mb="4">
                Lista de Amigos
            </Text>
            {friends.length > 0 ? (
                <List spacing={3}>
                    {friends.map((friend, index) => (
                        <div key={friend._id}>
                            <ListItem>
                                <Text>{friend.username}</Text>
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
        <Footer/>
        </>  
        
    );
};

export default FriendList;

