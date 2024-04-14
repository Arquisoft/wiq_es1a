import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Text, Heading, Table, Thead, Tbody, Tr, Th, Td, Avatar, Link } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const GroupDetails = () => {
  const { t } = useTranslation();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const { groupName } = useParams();
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/group/${encodeURIComponent(groupName)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGroup(data);
      setError(null);
    } catch (error) {
      setError(error);
      console.error("Error al obtener los detalles del grupo:", error);
    }
  };
  

  const redirectToProfile = (username) => {
    navigate(`/perfil?user=${username}`);
  };

  if (error) {
    return (
      <>
        <Nav />
        <Box>
          <Heading as="h2">Error: {error.message}</Heading>
        </Box>
        <Footer />
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Nav />
        <Box>
          <Heading as="h2">Cargando...</Heading>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    group && (
      <>
        <Nav/>
        <Container maxW="md" mt="5">
          <Heading as="h1" mb="5">{t('pages.groupdetails.details')} {group.name}</Heading>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb="4">
              {t('pages.groupdetails.createdBy')} {group.members.length > 0 ? group.members[0] : ''} 
              {t('pages.groupdetails.when')} {new Date(group.createdAt).toLocaleDateString()}
            </Text>
    
            <Text fontSize="lg" fontWeight="bold" mb="2">{t('pages.groupdetails.participants')} ({group.members.length}) :</Text>
            <Table variant="striped">
              <Thead>
                <Tr>
                  <Th>{t('pages.groupdetails.avatar')}</Th>
                  <Th>{t('pages.groupdetails.name')}</Th>
                  <Th>{t('pages.groupdetails.viewProfile')}</Th>
                  <Th>{t('pages.groupdetails.viewStats')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {group.members.map((member, index) => (
                  <Tr key={index}>
                    <Td>
                      <Avatar size="sm" name={member}  data-testid={`user-avatar-${member}`}/>
                    </Td>
                    <Td>{member}</Td>
                    <Td>
                      <Link data-testid={`view-profile-button-${member}`} color="blue.500" onClick={() => redirectToProfile(member)}>{t('pages.groupdetails.viewProfile')}</Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Container>
        <Footer/>
      </>
    )
  );
};

export default GroupDetails;

