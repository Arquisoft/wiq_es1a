import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Text, List, ListItem, Button, Input, Alert } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const UserGroups = () => {
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
      const userGroups = response.data.groups.filter(group => group.members.includes(username));
      setGroups(userGroups);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const seeGroupDetails = async (groupId) => {
    try {
      const response = await fetch(`${apiEndpoint}/group/${groupId}`);
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error('Failed to see group details');
      }
  
      const { group } = data;
  
      setGroups(prevGroups => prevGroups.filter(existingGroup => existingGroup._id !== group._id));
    } catch (error) {
      console.error('Error seeing group details:', error);
    }
  };

  return (
    <>
      <Nav/>
      <Container maxW="xs" mt="8">
        <Box mt="8">
          <Text fontSize="3xl" fontWeight="bold" mb="4">Tus grupos</Text>
          <List>
            {groups.map((group) => (
              <ListItem key={group._id} display="flex" justifyContent="space-between" alignItems="center" mb="2">
                <Text>{group.name}</Text>
                <Button colorScheme="blue" onClick={() => seeGroupDetails(group._id)}>Join</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <Footer/>
    </>
  );
};

export default UserGroups;
