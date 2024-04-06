import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Text, List, ListItem, Button, Divider, Input, Snackbar } from '@chakra-ui/react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const username = localStorage.getItem('username');

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/group/list`);
        setGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const addGroup = async () => {
    try {
      await axios.post(`${apiEndpoint}/group/add`, {
        name: name,
        username: username
      });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`${apiEndpoint}/group/join`, { groupId });
      setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxW="xs" mt="8">
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb="4">Create a Group</Text>
        <Input
          name="name"
          mb="4"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button colorScheme="blue" onClick={addGroup} mb="4">Create</Button>
        <Snackbar isOpen={openSnackbar} onClose={handleCloseSnackbar} placement="bottom" colorScheme="green">
          Group created successfully
        </Snackbar>
        {error && (
          <Snackbar isOpen={!!error} onClose={() => setError('')} placement="bottom" colorScheme="red">
            {`Error: ${error}`}
          </Snackbar>
        )}
      </Box>

      <Box mt="8">
        <Text fontSize="3xl" fontWeight="bold" mb="4">GROUPS</Text>
        <List>
          {groups.map((group) => (
            <ListItem key={group.name} display="flex" justifyContent="space-between" alignItems="center" mb="2">
              <Text>{group.name}</Text>
              <Button colorScheme="blue" onClick={() => handleJoinGroup(group._id)}>Join</Button>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Groups;

