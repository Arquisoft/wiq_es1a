import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Button, Snackbar, Box, Divider, TextField } from '@mui/material';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8001';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const username = localStorage.getItem('username'); // Obtener el nombre de usuario del localStorage

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
        username: username // Pasar el nombre de usuario a la solicitud
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
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1' }}>
      <Box sx={{ margin: '2em' }}>
        <Box>
          <Typography component="h1" variant="h5">
            Create a Group
          </Typography>
          <TextField
            name="name"
            margin="normal"
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Divider style={{ marginTop: '3%' }} />
          <Button variant="contained" color="primary" onClick={addGroup} style={{ width: '100%', marginTop: '5%' }}>
            Create
          </Button>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Group created successfully" />
          {error && (<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />)}
        </Box>
      </Box>

      <Container sx={{ margin: '0 auto auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3">GROUPS</Typography>
        <List sx={{ margin: '0' }}>
          {groups.map((group) => (
            <ListItem key={group.name} sx={{ display: 'flex', alignContent: 'space-between', margin: '0' }}>
              <ListItemText primary={group.name} />
              <Button variant="contained" color="primary" onClick={() => handleJoinGroup(group._id)}>
                Unirse
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
    </Container>
  );
};

export default Groups;
