import React from "react";
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Heading,
  Avatar,
} from "@chakra-ui/react";
import Nav from "../../components/Nav/Nav.js";
import Footer from "../../components/Footer/Footer.js";
import { useTranslation } from "react-i18next";

const Sobre = () => {
  const { t } = useTranslation();

  const designers = [
    { name: "Martín Cancio Barrera", id: "UO287561", github: "CANCI0" },
    { name: "Iyán Fernández Riol", id: "UO288231", github: "iyanfdezz" },
    { name: "Rodrigo García Iglesias", id: "UO276396", github: "Rodrox11" },
  ];

  return (
    <>
      <Nav />
      <Flex flexDirection="column" rowGap="1rem">
        <Heading as="h1">{t("pages.about.title")}</Heading>
        <Heading as="h2" size="md">
          {t("pages.about.description")}
        </Heading>
        <Table className="designers-table" id="designers-table">
          <Thead>
            <Tr>
              <Th textAlign="center">{t("pages.about.name")}</Th>
              <Th textAlign="center">{t("pages.about.uo")}</Th>
              <Th textAlign="center">{t("pages.about.github")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {designers.map((designer, index) => (
              <Tr key={index}>
                <Td>
                  <Flex flexDirection="column" alignItems="center">
                    <Avatar
                      src={
                        "https://avatars.githubusercontent.com/" +
                        designer.github
                      }
                    />
                  </Flex>
                  {designer.name}
                </Td>
                <Td>{designer.id}</Td>
                <Td>
                  <Link
                    href={"https://github.com/" + designer.github}
                    isExternal
                  >
                    {t("pages.about.mygithub")}
                  </Link>
                </Td>
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
