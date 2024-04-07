import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Text, List, ListItem, Button, Input, Alert } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useNavigate } from "react-router-dom";

const UserGroups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

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
    navigate(`/group/${groupId}`);
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
                <Button colorScheme="blue" onClick={() => seeGroupDetails(group._id)}>Ver grupo</Button>
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
