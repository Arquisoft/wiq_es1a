import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Box, Container, Text, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserGroups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`${apiEndpoint}/group/list`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          const userGroups = data.filter(group => group.members.includes(username));
          setGroups(userGroups);
        } else {
          setError('Error fetching data: Invalid response format');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data: ' + error.message);
      });
  };
  
  

  const seeGroupDetails = (groupName) => {
    navigate(`/social/grupo/${encodeURIComponent(groupName)}`);
  };
  

  return (
    <>
      <Nav />
      <Container maxW="xs" mt="5" textAlign="center">
        <Box mt="5">
          <Text fontSize="3xl" fontWeight="bold" mb="4">{t('pages.usergroups.title')}</Text>
          {error && (
            <Alert status="error" variant="subtle" mt="2">
              {`Error: ${error}`}
            </Alert>
          )}
          <Table variant="simple" mx="auto">
            <Thead>
              <Tr>
                <Th>{t('pages.groupsTable.groupName')}</Th>
                <Th>{t('pages.groupsTable.creationDate')}</Th>
                <Th>{t('pages.groupsTable.creator')}</Th>
                <Th>{t('pages.usergroups.seegroup')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groups.map((group) => (
                <Tr key={group._id}>
                  <Td>{group.name}</Td>
                  <Td>{group.members.length > 0 ? group.members[0] : ''}</Td>
                  <Td>{new Date(group.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <Button colorScheme="blue" onClick={() => seeGroupDetails(group.name)}>{t('pages.usergroups.seegroup')}</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Container>
      <Footer />
    </>
  );
  
  
  
};

export default UserGroups;
