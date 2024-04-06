import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';


const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // Obtener el nombre de usuario del usuario autenticado del almacenamiento local
                const username = localStorage.getItem('username');

                // Hacer una solicitud al backend para obtener la lista de amigos del usuario autenticado
                const response = await axios.get(`${apiEndpoint}/friends/${username}`);

                // Establecer la lista de amigos en el estado
                setFriends(response.data.friends);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <Container maxWidth="sm">
            <Typography variant="h3" align="center" gutterBottom>
                Lista de Amigos
            </Typography>
            {friends.length > 0 ? (
                <List>
                    {friends.map((friend, index) => (
                        <div key={friend._id}>
                            <ListItem>
                                <ListItemText primary={friend.username} />
                            </ListItem>
                            {index !== friends.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            ) : (
                <Typography variant="body1" align="center">
                    No tienes amigos actualmente.
                </Typography>
            )}
        </Container>
    );
};

export default FriendList;
