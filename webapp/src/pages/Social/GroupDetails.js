import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Text } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const { groupName } = useParams();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/group/${encodeURIComponent(groupName)}`); // Cambiar groupId a groupName
        setGroup(response.data.group);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [groupName]); // Cambiar groupId a groupName

  return (
    <>
      <Nav/>
      <Container maxW="md" mt="8">
        {group ? (
          <Box>
            <Text fontSize="2xl" fontWeight="bold" mb="4">{group.name}</Text>
            <Text fontSize="2xl" fontWeight="bold" mb="4">
              Creado por {group.members.length > 0 ? group.members[0] : ''} 
              el {new Date(group.createdAt).toLocaleDateString()}
            </Text>
            <Text fontSize="lg" mb="4">Participantes: {group.members.length}</Text>
            <Text fontSize="lg" mb="2">Lista de participantes:</Text>
            <ul>
              {group.members.map((member, index) => (
                <li key={index}>
                  {member}
                </li>
              ))}
            </ul>
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
