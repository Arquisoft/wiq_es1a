import React from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const CustomModal = ({ title, text, route }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={onOpen}>{title}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {text}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cerrar
            </Button>
            <Button variant='ghost' onClick={() => navigate(route)}>Jugar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;
