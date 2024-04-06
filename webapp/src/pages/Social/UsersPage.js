import React, { useState, useEffect } from "react";
import { Input, Button, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const UserList = ({ users, handleAddFriend }) => {
  
  return (
    <div>
      <Heading as="h2">Lista de Usuarios</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Nombre de Usuario</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map(user => (
            <Tr key={user._id}>
              <Td>{user.username}</Td>
              <Td>
                {user.isFriend ? (
                  <span>Amigo</span>
                ) : (
                  <Button onClick={() => handleAddFriend(user)}>Agregar como amigo</Button>
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
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setIsLoading(true);
    fetch(apiEndpoint + `/users/search`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // Filtrar el usuario actual de la lista de usuarios
      const updatedUsers = data.filter(user => user.username !== currentUser);
      // Verificar si cada usuario es amigo o no
      updatedUsers.forEach(user => {
        user.isFriend = friends.some(friend => friend._id === user._id);
      });
      setUsers(updatedUsers);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      setError(error.message || 'Ha ocurrido un error al obtener los usuarios');
      setIsLoading(false);
    });
  };

  const handleAddFriend = async (user) => {
    try {
      // Realizar la solicitud HTTP POST al endpoint '/users/add-friend'
      const response = await fetch(apiEndpoint+'/users/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: localStorage.username, // Nombre de usuario del usuario actual
          friendUsername: user.username // Nombre de usuario del amigo que se está agregando
        })
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar amigo');
      }
  
      // Agregar el usuario a la lista de amigos localmente
      setFriends(prevFriends => [...prevFriends, user]);
      // Actualizar el estado de isFriend del usuario
      setUsers(prevUsers => {
        return prevUsers.map(u => {
          if (u._id === user._id) {
            return { ...u, isFriend: true };
          }
          return u;
        });
      });
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      // Manejar el error según sea necesario
    }
  };

  
  return (
    <>
      <Nav />
      <div>
        {isLoading && <p>Cargando usuarios...</p>}
        {error && <p>Error al cargar usuarios: {error}</p>}
        <UserList users={users} handleAddFriend={handleAddFriend} />
      </div>
      <Footer />
    </>
  );
};

export default UsersPage;
