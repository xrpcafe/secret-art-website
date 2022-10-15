import {
    Box,
    Button,
    Flex,
    Link,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Center,
    Stack,
    useDisclosure,
    Image,
    ChakraProvider,
    Spinner
  } from "@chakra-ui/react";
  import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";

  const ModalHeaderClass = {
    borderBottom: '1px solid #2D2D2D',
    textAlign: 'center',
    fontSize: '16px',
    background: '#262626',
    color:'white'
  };

  const ModalBodyClass = {
    background: '#2d2d2d',
    color:'white'
  }

  const smallText = {
    textAlign: 'center',
    fontSize: '12px'
  };

  export default function VoteStatus(props) {

    function handleClose() {
        props.closeModal();
      }
    
    return (
      <>
  <ChakraProvider>
<Modal onClose={handleClose} size="sm" isOpen={props.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader style={ModalHeaderClass}>Vote Status</ModalHeader>
          <ModalCloseButton color="white"/>
          <ModalBody style={ModalBodyClass}>
          <Stack
        direction={'column'}
        spacing={3}
        align={'center'}
        alignSelf={'center'}
        position={'relative'}>
                         <Text> {props.requestResolvedMessage}</Text>
          </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      </ChakraProvider>
      </>
    )
  }