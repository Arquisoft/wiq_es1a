import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Box, Text, Heading, Table, Thead, Tbody, Tr, Th, Td, Avatar, Link } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";

const GroupDetails = () => {
  const [group, setGroup] = useState(null);
  const { groupName } = useParams();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const navigate = useNavigate();

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

  const redirectToProfile = (username) => {
    navigate(`/perfil?user=${username}`);
  };

  return (
    <>
      <Nav/>
      <Container maxW="md" mt="5">
        <Heading as="h1" mb="5">Detalles del grupo: {groupName}</Heading>
        {group ? (
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb="4">
              Creado por {group.members.length > 0 ? group.members[0] : ''} el {new Date(group.createdAt).toLocaleDateString()}
            </Text>
  
            <Text fontSize="lg" fontWeight="bold" mb="2">Participantes ({group.members.length}) :</Text>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>Avatar</Th>
                  <Th>Nombre</Th>
                  <Th>Ver perfil</Th>
                </Tr>
              </Thead>
              <Tbody>
                {group.members.map((member, index) => (
                  <Tr key={index}>
                    <Td>
                      <Avatar size="sm" name={member} />
                    </Td>
                    <Td>{member}</Td>
                    <Td>
                      <Link color="blue.500" onClick={() => redirectToProfile(member)}>Ver perfil</Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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

