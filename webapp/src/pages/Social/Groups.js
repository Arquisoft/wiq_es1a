import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Text, Button, Input, InputGroup, InputRightElement, Alert, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const Groups = () => {
  const { t } = useTranslation();
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

  return (
    <>
      <Nav />
      <Container maxW="md" mt="5">
        <Box mb="5">
          <Text fontSize="2xl" fontWeight="bold" mb="4">{t('pages.groups.title')}</Text>
          <Box display="flex" alignItems="center">
            <InputGroup flex="1" mr="4">
              <Input
                name="name"
                placeholder={t('pages.groups.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <Button colorScheme="blue" onClick={addGroup}>{t('pages.groups.create')}</Button>
          </Box>
          {error && (
            <Alert status="error" variant="subtle" mt="2">
              {`Error: ${error}`}
            </Alert>
          )}
        </Box>
  
        <Box mt="4">
          <Text fontSize="3xl" fontWeight="bold" mb="4">{t('pages.groups.joinable')}</Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t('pages.groupsTable.groupName')}</Th>
                <Th>{t('pages.groupsTable.creationDate')}</Th>
                <Th>{t('pages.groupsTable.creator')}</Th>
                <Th>{t('pages.groups.join')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {groups.map((group) => (
                <Tr key={group._id}>
                  <Td>{group.name}</Td>
                  <Td>{new Date(group.createdAt).toLocaleDateString()}</Td>
                  <Td>{group.members.length > 0 ? group.members[0] : ''}</Td>
                  <Td>
                    <Button colorScheme="blue" onClick={() => handleJoinGroup(group._id)}>{t('pages.groups.join')}</Button>
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

export default Groups;

