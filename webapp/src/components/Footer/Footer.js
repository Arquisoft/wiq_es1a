import React from 'react';
import { Box, Heading, Text, useColorMode } from '@chakra-ui/react';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    const { colorMode } = useColorMode();
    const bgColor = { light: 'gray.200', dark: 'gray.700' };
    const textColor = { light: 'black', dark: 'white' };

    return (
        <Box
            as="footer"
            textAlign="center"
            position="relative"
            bottom="0"
            width="100%"
            p={4}
            bg={bgColor[colorMode]}
            color={textColor[colorMode]}
        >
            <Heading as="h2" fontSize="xl">
                WIQ!
            </Heading>
            <Text fontSize="sm" mt={2}>
                {t('components.footer.copyright')}
            </Text>
        </Box>
    );
}

export default Footer;
