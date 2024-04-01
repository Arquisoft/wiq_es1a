import React from "react";
import { Flex, Table, Thead, Tbody, Tr, Th, Td, Link, Center, Heading } from "@chakra-ui/react";
import Nav from '../../components/Nav/Nav.js';
import Footer from '../../components/Footer/Footer.js';

const Sobre = () => {
  const designers = [
    { name: 'Martín Cancio Barrera', id: 'UO287561', github: 'https://github.com/CANCI0' },
    { name: 'Iyán Fernández Riol', id: 'UO288231', github: 'https://github.com/iyanfdezz' },
    { name: 'Rodrigo García Iglesias', id: 'UO276396', github: 'https://github.com/Rodrox11' }
  ];

  return (
    <>
      <Nav />
      <Flex flexDirection="column" rowGap="1rem">
        <Heading as="h1">Equipo WIQ_es1a</Heading>
        <Heading as="h2" size="md">Nuestro equipo de desarrollo</Heading>
        <Table className="designers-table" id="designers-table">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>UO</Th>
              <Th>GitHub</Th>
            </Tr>
          </Thead>
          <Tbody>
            {designers.map((designer, index) => (
              <Tr key={index}>
                <Td>{designer.name}</Td>
                <Td>{designer.id}</Td>
                <Td><Link href={designer.github} isExternal>Mi GitHub</Link></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
      <Footer />
    </>
  );
};

export default Sobre;
