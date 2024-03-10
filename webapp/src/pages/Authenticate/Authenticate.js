import React, { useState } from 'react';
import AddUser from '../../components/Register/Register';
import Login from '../../components/Login/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Footer from '../../components/Footer/Footer.js';

function Authenticate() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Bienvenido a WIQ
      </Typography>
      {showLogin ? <Login /> : <AddUser />}
      <Typography component="div" align="center" sx={{ marginTop: 2 }}>
        {showLogin ? (
          <Link name="gotoregister" component="button" variant="body2" onClick={handleToggleView}>
            ¿No tienes cuenta? Regístrate.
          </Link>
        ) : (
          <Link component="button" variant="body2" onClick={handleToggleView}>
            Ya tienes cuenta? Inicia sesión.
          </Link>
        )}
      </Typography>
      <Footer />
    </Container>
  );
}

export default Authenticate;
