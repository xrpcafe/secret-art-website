import React, { useEffect, useRef } from 'react';
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
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import GalleryPicker from './gallery.js';
import {isMobile, isBrowser, isDesktop} from 'react-device-detect';
import TransactionXumm from './xummmodal.js';
import VoteStatus from './votestatus.js';
import Cookies from 'universal-cookie';
const xrpl = require('xrpl')

export default function GalleryMain(props) {
  const recaptchaRef = React.useRef();
  const [validationFailed, setValidationFailed] = React.useState(false)
  const [validationFailedMsg, setValidationFailedMsg] = React.useState('')
  const [requestFailed, setRequestFailed] = React.useState(false)
  const [requestResolved, setRequestResolved] = React.useState(false)
  const [requestResolvedMessage, setrequestResolvedMessage] = React.useState('')
  const [txnId, setTxnId] = React.useState('')
  const [verifiedClicked, setVerifiedClicked] = React.useState(false)
  const [showSpinner, setShowSpinner] = React.useState(false)
  const [listenWs, setlistenWs] = React.useState(false)
  const [qrMatrix, setQrMatrix] = React.useState("")
  const [wsConnection, setwsConnection] = React.useState("")
  const [mobileTxnUrl, setMobileTxnUrl] = React.useState("")
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [projectData, setProjectData] = React.useState(null)
  const ws = useRef(WebSocket);
  const [xrpAddressInputVal, setxrpAddressInputVal] = React.useState('');
  const [showVoteStatus, setshowVoteStatus] = React.useState(false)
  const [isConfirming, setisConfirming] = React.useState(false)
  const [tokenIdClicked, setTokenIdClicked] = React.useState('');

  function closeVoteStatus()
  {
    setshowVoteStatus(false)
  }

  function closeModal()
  {
    setVerifiedClicked(false)
    setShowSpinner(false)
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


  async function Vote(tokenId)
  {
    setTokenIdClicked(tokenId)
    let memo = '{"session":"' + props.session + '", "vote":"' + tokenId + '"}'
    const memoData = await xrpl.convertStringToHex(memo)

    
    const request = {
         "TransactionType": "Payment",
         "Account": props.userAddress,
         "Destination" : process.env.REACT_APP_PROXY_VOTINGWALLET,
         "Amount": "1",
         "Memos": [
           {
             "Memo": {
               "MemoData": memoData
             }
           }
         ]
       }

       let responseXum = await postXummPayload(request)
        if(responseXum.data?.refs.qr_matrix)
        {
          setwsConnection(responseXum.data?.refs.websocket_status)
          setQrMatrix(responseXum.data?.refs.qr_png)
          setMobileTxnUrl(responseXum.data?.next.always)
          setVerifiedClicked(true)
          setShowSpinner(true)
          setlistenWs(true)

          if(isMobile)
          {
            //window.open(responseXum.data?.next.always);
            window.open('xumm://xumm.app/sign/' + responseXum.data?.uuid + '/deeplink');
          }
  
          ws.current = new WebSocket(responseXum.data?.refs.websocket_status);
    
          const wsCurrent = ws.current;
          return () => {
              wsCurrent.close();
          };
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
              if(payload.data != null)
              {
                let payloadMeta = payload.data
                if(payloadMeta.meta.resolved == true && payloadMeta.meta.signed == true)
                {
                   setrequestResolvedMessage('Sign request successful. Your vote has successfully been recorded. Thank you for voting!');
                   setshowVoteStatus(true);
                   const cookies = new Cookies();
                   cookies.set('voted', 'true', { path: '/' });
                   props.setVoteState(true)
                }
                else if(payloadMeta.meta.resolved == true && payloadMeta.meta.signed == false)
                {
                   setRequestFailed(true)
                   setrequestResolvedMessage('Sign request has been rejected.');
                   setshowVoteStatus(true);
                }
                else if(payloadMeta.meta.resolved == false && payloadMeta.meta.signed == false && payloadMeta.meta.cancelled == true && payloadMeta.meta.expired == true)
                {
                   setRequestFailed(true)
                   setrequestResolvedMessage('Sign request has been cancelled.');
                   setshowVoteStatus(true);
                }
                else if(payloadMeta.meta.resolved == false && payloadMeta.meta.signed == false && payloadMeta.meta.cancelled == false && payloadMeta.meta.expired == true)
                {
                   setRequestFailed(true)
                   setrequestResolvedMessage('Sign request has expired.');
                   setshowVoteStatus(true);
                }
              }
              closeModal();
              setShowSpinner(false);
              setRequestResolved(true);
              ws.current.close();
            }
        };
    }, [listenWs]);


  return (
    <>
    {props.nfts != undefined ? <div>
      {props.nfts.length > 0 ? (
        <>
          {verifiedClicked && isBrowser ? <TransactionXumm isOpen={onOpen} onClose={onClose} txnPng={qrMatrix} closeModal={closeModal} TransactionTextHeader={'Vote'} TransactionText={'Approve Micropayment Voting for #' + tokenIdClicked} /> : <></> }
          {showVoteStatus ? <VoteStatus isOpen={onOpen} onClose={onClose} isConfirming={isConfirming} requestResolvedMessage={requestResolvedMessage} closeModal={closeVoteStatus} /> : <></>}
          <section className="vote section is-medium is-cozy">
              <div className="container">
              <ul className="vote-list">
              <GalleryPicker nftArray={props.nfts} userAddress={props.userAddress} session={props.session} votecallback={Vote} voted={props.voted} />
              </ul>
              </div>
            </section>
        </>
      ) : (
          <section className="section notification is-info is-light" style={{textAlign:'center'}}>
            <strong>Loading...</strong><Spinner style={{width:'15px', height:'15px'}} marginLeft={"5px"} />
          </section>
            
      )}
    </div> : <></>}
    </>
  );
}