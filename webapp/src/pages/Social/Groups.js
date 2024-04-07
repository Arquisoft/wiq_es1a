import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Text, List, ListItem, Button, Input, Alert } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const username = localStorage.getItem('username');

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/group/list`);
      const userGroups = response.data.groups.filter(group => !group.members.includes(username));
      setGroups(userGroups);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addGroup = async () => {
    try {
      await axios.post(`${apiEndpoint}/group/add`, {
        name: name,
        username: username
      });
      setAlertMessage('Group created successfully');
      setOpenAlert(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleJoinGroup = (groupId) => {
    fetch(`${apiEndpoint}/group/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        groupId: groupId,
        username: localStorage.getItem('username')
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
    })
    .catch(error => {
      console.error('Error joining group:', error);
    });
  };
  

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      <Nav/>
      <Container maxW="xs" mt="8">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb="4">Crea un grupo</Text>
          <Input
            name="name"
            mb="4"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button colorScheme="blue" onClick={addGroup} mb="4">Crear</Button>
          <Alert status="success" variant="subtle" mt="2" isOpen={openAlert} onClose={handleCloseAlert}>
            {alertMessage}
          </Alert>
          {error && (
            <Alert status="error" variant="subtle" mt="2">
              {`Error: ${error}`}
            </Alert>
          )}
        </Box>

        <Box mt="8">
          <Text fontSize="3xl" fontWeight="bold" mb="4">Grupos a los que puedes unirte</Text>
          <List>
            {groups.map((group) => (
              <ListItem key={group._id} display="flex" justifyContent="space-between" alignItems="center" mb="2">
                <Text>{group.name}</Text>
                <Button colorScheme="blue" onClick={() => handleJoinGroup(group._id)}>Join</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <Footer/>
    </>
  );
};

export default Groups;


