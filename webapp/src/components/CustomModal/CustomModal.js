import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const CustomModal = ({ title, text, route }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <>
      <Button onClick={onOpen}>{title}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxWidth={{base: "90%", lg: "30%"}} >
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='justify'>
            {text}
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' mr={3} onClick={onClose}>
            {t("components.custommodal.close")}
            </Button>
            <Button colorScheme='blue' onClick={() => navigate(route)}>{t("components.custommodal.play")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
