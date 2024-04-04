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
                <Button onClick={() => handleAddFriend(user)}>Agregar como amigo</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
    fetch(`http://localhost:8001/users/search?search=${searchQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // Filtrar el usuario actual de la lista de usuarios
      const filteredUsers = data.filter(user => user.username !== currentUser);
      setUsers(filteredUsers);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      setError(error.message || 'Ha ocurrido un error al obtener los usuarios');
      setIsLoading(false);
    });
  };

  const handleAddFriend = (user) => {
    // Verifica si el usuario ya está en la lista de amigos
    if (friends.find(friend => friend._id === user._id)) {
      console.log(`El usuario ${user.username} ya está en tu lista de amigos.`);
      return;
    }

    // Agrega el usuario a la lista de amigos
    setFriends(prevFriends => [...prevFriends, user]);

    // Aquí puedes implementar la lógica para enviar una solicitud al backend para agregar el usuario como amigo
    console.log(`Agregando usuario ${user.username} como amigo...`);
  };

  return (
    <>
      <Nav />
      <div style={{ marginBottom: '20px' }}> {/* Agrega un margen inferior al contenedor del componente de búsqueda */}
        <Heading as="h2">Buscar Usuarios</Heading>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre de usuario"
        />
        <Button onClick={fetchUsers} ml={2}>Buscar</Button> {/* Agrega un margen a la izquierda del botón de búsqueda */}
      </div>
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
