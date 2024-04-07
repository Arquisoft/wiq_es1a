import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Text } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const { groupId } = useParams();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/group/${groupId}`);
        setGroup(response.data.group);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return (
    <>
      <Nav/>
      <Container maxW="md" mt="8">
        {group ? (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb="4">{group.name}</Text>
            <Text fontSize="2xl" fontWeight="bold" mb="4">
                Creado por {group.members.length > 0 ? group.members[0] : ''} 
                el {new Date(group.createdAt).toLocaleDateString()}</Text>
            <Text fontSize="lg" mb="4">Participantes: {group.members.length}</Text>
          </Box>
        ) : (
          <Text>Loading...</Text>
        )}
      </Container>
      <Footer/>
    </>
  );
};

export default GroupDetails;
