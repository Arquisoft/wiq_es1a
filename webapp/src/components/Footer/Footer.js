import React from 'react';
import { Box, Heading, Text, useColorMode } from '@chakra-ui/react';

const Footer = () => {
    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.200', dark: 'gray.900' };
    const textColor = { light: 'black', dark: 'white' };

    return(
        <Box as="footer" textAlign="center" p={4} bg={bgColor[colorMode]} color={textColor[colorMode]} position="sticky" bottom="0" width="100%">
            <Heading as="h2" fontSize="xl">WIQ!</Heading>
            <Text fontSize="sm" mt={2}>Copyright 2024 ® Grupo 1A de Arquitectura del Software</Text>
        </Box>
    );
}

export default Footer;
