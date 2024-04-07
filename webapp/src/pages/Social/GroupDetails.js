import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Text, Heading, List, ListItem } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const { groupName } = useParams();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/group/${encodeURIComponent(groupName)}`);
        setGroup(response.data.group);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupName]);

  return (
    <>
      <Nav/>
      <Container maxW="md" mt="8">
        <Heading as="h1" mb="4">Detalles del grupo</Heading>
        {group ? (
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb="2">Nombre:</Text>
            <Text fontSize="xl" mb="4">{group.name}</Text>

            <Text fontSize="lg" fontWeight="bold" mb="2">Creado por:</Text>
            <Text fontSize="xl" mb="4">{group.members.length > 0 ? group.members[0] : ''}</Text>

            <Text fontSize="lg" fontWeight="bold" mb="2">Fecha de creación:</Text>
            <Text fontSize="xl" mb="4">{new Date(group.createdAt).toLocaleDateString()}</Text>

            <Text fontSize="lg" fontWeight="bold" mb="2">Participantes ({group.members.length}):</Text>
            <List>
              {group.members.map((member, index) => (
                <ListItem key={index}>
                  {member}
                </ListItem>
              ))}
            </List>
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

