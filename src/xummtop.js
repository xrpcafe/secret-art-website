import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Container,
  Flex,
  HStack,
  Box,
  Spacer,
  VStack,
  useDisclosure,
  TextBox
} from '@chakra-ui/react';
import { CheckIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {isMobile, isBrowser, isDesktop, isAndroid} from 'react-device-detect';
import TransactionXumm from './xummmodal.js'
import React, { useState, useRef, useEffect } from "react";
require("dotenv").config();


export default function XummTop(props) {
    const ws = useRef(WebSocket);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [wsConnection, setwsConnection] = React.useState("")
    const [qrMatrix, setQrMatrix] = React.useState("")
    const [mobileTxnUrl, setMobileTxnUrl] = React.useState("")
    const [showSpinner, setShowSpinner] = React.useState(false)
    const [listenWs, setlistenWs] = React.useState(false)
    const [requestResolved, setRequestResolved] = React.useState(false)
    const [requestResolvedMessage, setrequestResolvedMessage] = React.useState('')
    const [requestFailed, setRequestFailed] = React.useState(false)
    const [signedinAccount, setSignedinAccount] = React.useState("")
    const [signInClicked, setSignInClicked] = React.useState(false)

    function closeModal()
    {
      setSignInClicked(false)
      setShowSpinner(false)
    } 

    function Logout()
    {
        props.logout();
    }

    const postXummPayload = async (requestContent) => {
        try {
          let response = await fetch(process.env.REACT_APP_PROXY_ENDPOINT + '/xumm/createpayload', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestContent)
          });
          let json = await response.json()
          return { success: true, data: json };
        } catch (error) {
          return { success: false };
        }
      }

      const getXummPayload = async (requestContent) => {
        try {
          let response = await fetch(process.env.REACT_APP_PROXY_ENDPOINT + '/xumm/getpayload', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"payloadID" : requestContent})
          });
          let json = await response.json()
          return { success: true, data: json };
        } catch (error) {
          return { success: false };
        }
      }

      const checkValidSignature = async (requestContent) => {
        try {
          let response = await fetch(process.env.REACT_APP_PROXY_ENDPOINT + '/xumm/checksig', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"hex" : requestContent})
          });
          let json = await response.json()
          return { success: true, data: json };
        } catch (error) {
          return { success: false };
        }
      }

      const Signin = async () => {
    
        var request;
        if(isDesktop)
        {
             request = {
                "txjson": {
                  "TransactionType": "SignIn"
                }
        }
    } else {
        request = {
            "txjson": {
              "TransactionType": "SignIn"
            },
    }
    }
           let responseXum = await postXummPayload(request)
           if(responseXum.data?.refs.qr_matrix)
           {
             setwsConnection(responseXum.data?.refs.websocket_status)
             setQrMatrix(responseXum.data?.refs.qr_png)
             setMobileTxnUrl(responseXum.data?.next.always)
             setShowSpinner(true)
             setSignInClicked(true)
     
             ws.current = new WebSocket(responseXum.data?.refs.websocket_status);
             setlistenWs(true)
     
             if(isMobile)
             {
              if(isAndroid)
              {
                window.open('xumm://xumm.app/sign/' + responseXum.data?.uuid + '/deeplink');
              } else {
                window.open(responseXum.data?.next.always);
              }
             }
           }
         }


         useEffect(() => {
            //if (!ws.current) return;
            ws.current.onmessage = async (e) => {
                if (!listenWs) return;
                let responseObj = JSON.parse(e.data.toString())
                if(responseObj.signed != null)
                {
                  const payload = await getXummPayload(responseObj.payload_uuidv4)
                  const isValid = await checkValidSignature(payload.data.response.hex)
                  if(payload.data != null)
                  {
                    let payloadMeta = payload.data
                    if(payloadMeta.meta.resolved == true && payloadMeta.meta.signed == true)
                    {
                       setSignedinAccount(payloadMeta.response.account);
                       setrequestResolvedMessage('Sign-In request successful.');
                    }
                    else if(payloadMeta.meta.resolved == true && payloadMeta.meta.signed == false)
                    {
                       setRequestFailed(true)
                       setrequestResolvedMessage('Sign-In request has been rejected.');
                    }
                    else if(payloadMeta.meta.resolved == false && payloadMeta.meta.signed == false && payloadMeta.meta.cancelled == true && payloadMeta.meta.expired == true)
                    {
                       setRequestFailed(true)
                       setrequestResolvedMessage('Sign-In request has been cancelled.');
                    }
                    else if(payloadMeta.meta.resolved == false && payloadMeta.meta.signed == false && payloadMeta.meta.cancelled == false && payloadMeta.meta.expired == true)
                    {
                       setRequestFailed(true)
                       setrequestResolvedMessage('Sign-In request has expired.');
                    }
                  }
                  closeModal();
                  setShowSpinner(false);
                  setRequestResolved(true);
                  ws.current.close();
                  if(isMobile)
                  {
                    window.open(mobileTxnUrl);
                  }
                  if(isValid.data.xrpAddress != undefined && isValid.data.session != undefined)
                  {
                    props.setStateValues(isValid.data);
                  }
                }
            };
        }, [listenWs]);

  return (
  <>
  {props.userAddress == '' && props.userSession == '' ?
    <buttons>
    <button onClick={Signin}
      className="connect-button button is-medium is-brutal my my-2"
    >
      Connect to XUMM
    </button>
  </buttons> : 
  <>
    <buttons>
    <button onClick={Logout}
      className="connect-button button is-medium is-brutal my my-2"
    >
      Logout
    </button>
  </buttons><p id="wallet" className="is-visible">
              Connected to: {props.userAddress}
            </p></>
  }
  {signInClicked && isBrowser ? <TransactionXumm isOpen={onOpen} onClose={onClose} txnPng={qrMatrix} closeModal={closeModal} TransactionTextHeader={'Sign-In'} TransactionText={'Sign into XUMM'} /> : <></> }
  </>
  );
}