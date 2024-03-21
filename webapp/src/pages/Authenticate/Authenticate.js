import React, { useState } from "react";
import { Box, Button, Heading, Link } from "@chakra-ui/react";
import AddUser from "../../components/Register/Register";
import Login from "../../components/Login/Login";
import Footer from "../../components/Footer/Footer";

function Authenticate() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box className="main">
      <Box textAlign="center" mb={8}  mt={3}>
        <Heading as="h1" size="xl" color="teal.500">WIQ</Heading>
      </Box>
      <Box>
        {showLogin ? <Login /> : <AddUser />}
      </Box>
      <Footer />
    </Box>
  );
}

export default Authenticate;
