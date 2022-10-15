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
    ChakraProvider
  } from "@chakra-ui/react";
  import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";

  const ModalHeaderClass = {
    textAlign: 'center',
    fontSize: '16px',
  };

  const ModalBodyClass = {
    background: '#2d2d2d',
    color:'white'
  }

  const smallText = {
    textAlign: 'center',
    fontSize: '12px'
  };

  export default function TransactionXumm(props) {

    function handleClose() {
        props.closeModal();
      }
    
    return (
      <>
  <ChakraProvider>
<Modal onClose={handleClose} size="sm" isOpen={props.isOpen}>
        <ModalOverlay />
        <ModalContent className="box .p .p-2">
          <ModalHeader style={ModalHeaderClass}></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Stack
        direction={'column'}
        spacing={3}
        align={'center'}
        alignSelf={'center'}
        position={'relative'}>
                          <Text>{props.TransactionText}</Text>
                          <Image src={props.txnPng} />
          </Stack>
          <Text style={smallText}>Scan the QR code with your XUMM App to proceed.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
      </ChakraProvider>
      </>
    )
  }