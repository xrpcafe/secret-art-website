import {
    Flex,
    Stack,
    Heading,
    Text,
    Input,
    Button,
    Icon,
    useColorModeValue,
    createIcon,
    Link,
    Box
  } from '@chakra-ui/react';
  import XummTop from './xummtop.js';
  import GalleryMain from './gallerymain.js';
  import React, { useState, useEffect } from "react";
  import Cookies from 'universal-cookie';
  import Feature from './top5.js';
  import Countdown from 'react-countdown';
  require("dotenv").config();
  
  export default function Header() {
    const [nfts, setNfts] = useState([]);
    const [userAddress, setUserAddress] = React.useState('')
    const [userSession, setUserSession] = React.useState('')
    const [voted, setVoted] = React.useState(false)
//1663956000
//1664042400
    const myDate = new Date(1664042400*1000);
    const RenderXummButton = () => <XummTop setStateValues={setStateValues} userAddress={userAddress} userSession={userSession} logout={Logout} />;

// Renderer callback with condition
const renderer = ({days, hours, minutes, seconds, completed}) => {
  if (completed) {
    return <RenderXummButton />;
    // Render a completed state
  } else {
    // Render a countdown
    return <p>Voting Starts In: {days}d:{hours}h:{minutes}m:{seconds}s</p>;
  }
};
  
    useEffect(() => {
      const cookies = new Cookies();
      let userAddress = cookies.get('userAddress');
      let userSession = cookies.get('userSession');
      let voted = cookies.get('voted');
      if(userAddress != undefined && userSession != undefined)
      {
        setUserAddress(userAddress);
        setUserSession(userSession);
        fetchExistingVote(userAddress);
      }
      if(voted != undefined)
      {
          if(voted == 'true')
          {
            setVoted(true)
          }
      }
    }, []);
  
    function setVoteState(val)
    {
        setVoted(val);
    }
  
    function setStateValues(obj)
    {
      fetchExistingVote(obj.xrpAddress);
      const cookies = new Cookies();
      cookies.set('userAddress', obj.xrpAddress, { path: '/' });
      cookies.set('userSession', obj.session, { path: '/' });
      window.location = "/";
    }
  
    function Logout()
    {
      const cookies = new Cookies();
      cookies.remove('userAddress');
      cookies.remove('userSession');
      cookies.remove('voted');
      setUserAddress('');
      setUserSession('');
      setVoted(false);
    }


    const fetchNFTs = async () => {
        try {
          let response = await fetch(
            process.env.REACT_APP_PROXY_ENDPOINT + "/api/nft",
            {
              method: "GET"
            }
          );
          let json = await response.json();
          if (json.length > 0) {
            setNfts(json);
          }
        } catch (error) {
          console.log(error);
          return { success: false };
        }
      };


    const fetchExistingVote = async (address) => {
        try {
          let request = {"address": address}
          let response = await fetch(process.env.REACT_APP_PROXY_ENDPOINT + '/api/checkexisting', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          });
          
          let json = await response.json();
          console.log(json.response)
          if (json.response == true) {
            setVoted(true)
          } else {
            setVoted(false)
          }
        } catch (error) {
          console.log(error);
          return { success: false };
        }
      };
    
      useEffect(() => {
          fetchNFTs();
      }, []);


    const styleImg = {
        position: 'absolute',
        top:0,
        left:0,
        minWidth:'200px'
    }

    return (
<>
  <section className="is-cozy hero is-medium is-primary">
    <a href="https://xrp.cafe/">
      <svg
        className="xrpcafe-logo"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 116 31"
      >
        <path
          d="m36.04 22.99 3.03-3.62-2.8-3.31c-.27-.33-.41-.6-.41-.93 0-.68.52-1.12 1.13-1.12.48 0 .83.22 1.13.6l2.4 3.13 2.44-3.11c.28-.36.63-.63 1.05-.63.65 0 1.15.47 1.15 1.07 0 .34-.14.58-.34.82l-2.89 3.44 2.99 3.51c.26.33.4.6.4.93a1.1 1.1 0 0 1-1.13 1.12c-.48 0-.83-.22-1.13-.62l-2.58-3.32-2.58 3.32c-.28.34-.63.62-1.07.62-.63 0-1.13-.46-1.13-1.06 0-.35.12-.6.34-.85Zm11.88-7.74a1.22 1.22 0 1 1 2.44 0v1.1c.57-1.33 1.62-2.34 2.69-2.34.76 0 1.2.5 1.2 1.2 0 .65-.42 1.07-.96 1.17-1.74.3-2.93 1.63-2.93 4.14v3.13c0 .67-.55 1.2-1.23 1.2-.69 0-1.21-.52-1.21-1.2v-8.4Zm8.44 0c0-.68.52-1.22 1.2-1.22.7 0 1.24.54 1.24 1.22v.67a4.27 4.27 0 0 1 3.63-2c2.5 0 4.94 1.98 4.94 5.5v.05c0 3.52-2.42 5.5-4.94 5.5a4.35 4.35 0 0 1-3.63-1.87v3.76c0 .68-.55 1.2-1.23 1.2-.69 0-1.21-.52-1.21-1.2V15.25Zm8.53 4.22v-.04c0-2.05-1.4-3.4-3.05-3.4s-3.1 1.37-3.1 3.4v.04c0 2.03 1.45 3.4 3.1 3.4 1.66 0 3.05-1.3 3.05-3.4Zm6.1 2.41c.8 0 1.41.6 1.41 1.39v.2c0 .78-.6 1.39-1.41 1.39-.8 0-1.43-.6-1.43-1.39v-.2c0-.78.6-1.39 1.43-1.39Zm3.35-2.37v-.04a5.48 5.48 0 0 1 5.54-5.54c1.68 0 2.83.54 3.74 1.32.16.15.38.45.38.85 0 .62-.5 1.1-1.13 1.1-.3 0-.56-.12-.73-.24a3.38 3.38 0 0 0-2.28-.9c-1.77 0-3.08 1.52-3.08 3.37v.04c0 1.89 1.3 3.4 3.18 3.4.97 0 1.72-.39 2.38-.95.15-.12.39-.26.67-.26.58 0 1.05.48 1.05 1.07 0 .32-.12.58-.34.76-.95.9-2.1 1.5-3.88 1.5a5.43 5.43 0 0 1-5.5-5.48Zm11.5 2.2v-.05c0-2.29 1.8-3.41 4.4-3.41 1.18 0 2.03.18 2.86.44v-.26c0-1.5-.93-2.31-2.64-2.31-.93 0-1.7.16-2.36.42-.15.04-.26.06-.39.06-.56 0-1.03-.44-1.03-1 0-.45.3-.83.67-.97 1.01-.38 2.04-.62 3.43-.62 1.6 0 2.79.42 3.53 1.19.79.76 1.16 1.88 1.16 3.27v5.22c0 .66-.53 1.16-1.2 1.16-.7 0-1.18-.48-1.18-1.02v-.4a4.33 4.33 0 0 1-3.47 1.55c-2 0-3.78-1.15-3.78-3.28Zm7.3-.77v-.72a6.76 6.76 0 0 0-2.42-.43c-1.57 0-2.5.67-2.5 1.77v.04c0 1.03.9 1.6 2.08 1.6 1.6 0 2.84-.92 2.84-2.26Zm5.9-4.7h-.43c-.56 0-1.03-.44-1.03-1s.47-1.03 1.03-1.03h.42v-.78c0-1.16.3-2.05.87-2.61.57-.56 1.35-.84 2.4-.84.49 0 .9.04 1.23.1a1 1 0 0 1 .85 1c0 .54-.46 1.02-1.02 1a3.83 3.83 0 0 0-.5-.04c-.94 0-1.42.5-1.42 1.6v.59h1.9a1 1 0 1 1 0 2h-1.86v7.41c0 .67-.54 1.2-1.23 1.2a1.2 1.2 0 0 1-1.2-1.2v-7.4h-.02ZM110.84 25a5.3 5.3 0 0 1-5.46-5.5v-.05c0-3.03 2.16-5.52 5.2-5.52 3.4 0 5.07 2.77 5.07 5.22 0 .68-.53 1.17-1.15 1.17h-6.68a2.97 2.97 0 0 0 3.07 2.7c1.02 0 1.83-.37 2.52-.93a.9.9 0 0 1 .63-.22c.54 0 .97.42.97.98 0 .3-.15.56-.33.74a5.48 5.48 0 0 1-3.83 1.4Zm2.43-6.29c-.17-1.57-1.1-2.8-2.7-2.8-1.5 0-2.55 1.15-2.77 2.8h5.47Z"
          fill="#fff"
        />
        <path
          d="M5.41 25.05c1.41 1.2 8.7 3.1 14.5 1.04l.01-9.02c-1.7.6-4.14 1-7.6-.39-4.47-1.8-7.4.53-7.4.53s.34 7.71.5 7.84Z"
          fill="#fff"
          fillOpacity=".27"
        />
        <path
          d="M27 19.35a5.94 5.94 0 0 0-4.4-5.72v-2.69c-.11-1.23-1.8-1.73-3.28-2.03-1.67-.34-3.9-.53-6.24-.53-2.35 0-4.56.2-6.24.53-1.48.3-3.16.8-3.27 2.04v15.67c0 .23.06.46.15.67.9 2.07 5.6 2.8 9.36 2.8 3.77 0 8.48-.73 9.37-2.8.09-.2.14-.43.14-.66v-1.55a5.94 5.94 0 0 0 4.4-5.73Zm-20.55-8.4a27.1 27.1 0 0 1 6.63-.67 27.1 27.1 0 0 1 7.05.8c-1.12.37-3.5.79-7.05.79-3.54 0-5.94-.42-7.05-.8l.43-.12h-.01Zm14.23 15.61c-.29.58-3.11 1.63-7.6 1.63-4.5 0-7.31-1.05-7.6-1.63V12.88a12 12 0 0 0 1.35.35c1.68.34 3.9.53 6.25.53 2.34 0 4.56-.19 6.24-.53.45-.1.92-.2 1.36-.35v13.68Zm1.9-3.48v-7.44a4.03 4.03 0 0 1 0 7.44Z"
          fill="#fff"
        />
        <path
          d="M13.73 18.7a1.14 1.14 0 1 0-.37-2.24 1.14 1.14 0 1 0 .37 2.25ZM1.15 17.2a1.14 1.14 0 1 0 0-2.29 1.14 1.14 0 0 0 0 2.3ZM9.78 21.54c-.37 0-.67.3-.67.66a.73.73 0 0 1-1.45 0 .67.67 0 0 0-1.34 0 2.07 2.07 0 0 0 4.14 0c0-.36-.3-.66-.68-.66Zm.15-16.4a.95.95 0 0 0 .82 1.45c.32 0 .63-.17.81-.46a2.84 2.84 0 0 0-.4-3.47.95.95 0 0 1-.1-1.19A.95.95 0 0 0 9.47.42c-.74 1.11-.6 2.6.33 3.57.3.3.36.78.13 1.15Zm5.19 0a.95.95 0 0 0 .81 1.45c.32 0 .64-.17.82-.46a2.84 2.84 0 0 0-.4-3.47.95.95 0 0 1-.1-1.19.95.95 0 0 0-1.6-1.05c-.74 1.11-.6 2.6.34 3.57.3.3.35.78.13 1.15Z"
          fill="#fff"
        />
      </svg>
    </a>
    <div className="hero-body">
      <div className="container">
        <div className="columns is-variable is-6">
          <div className="column is-three-fifths">
            <div className="block content">
              <h1 className="title is-1 is-spaced">XRPL secret art event</h1>
              <h2 className="subtitle is-4">
                30+ NFT projects competing to create the best art derivative of
                another project.
              </h2>
              <p>
                <strong>September 24th @ 2pm EST, Live on Twitch!</strong>{" "}
                <br />{" "}
                <a href="https://twitch.tv/xrp_cafe">
                  https://twitch.tv/xrp_cafe
                </a>
              </p>
              <p>
                {" "}
                Submissions will be revealed on the day of the event, where the
                community and judges will vote. The vote will last for the
                duration of the Twitch Stream.
              </p>
              <Countdown
                date={myDate}
                renderer={renderer}
              />
              {/* <XummTop setStateValues={setStateValues} userAddress={userAddress} userSession={userSession} logout={Logout} /> */}
            </div>
          </div>
          <div className="column">
            <div className="box leaderboard">
              <svg
                className="cup-art"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 157 148"
              >
                <path
                  d="M47.7 26.8c-.4 2.5 1.4 5 4 5.3 2.6.4 5-1.4 5.3-4a4.7 4.7 0 1 0-9.4-1.3ZM56.2 72.4c-.1 1 0 1.9.2 2.8 2.5 9 21.3 14.8 36.7 17 15.4 2.1 35 1.8 39.9-6.2.5-.9.8-1.8 1-2.7l.9-6.4a24.7 24.7 0 0 0 6.5-47.2l1.5-10.4V18.6c.3-5.1-6.3-8.2-12.1-10.2-6.7-2.4-15.6-4.5-25.2-5.8a135 135 0 0 0-25.9-1.4c-6.2.4-13.4 1.5-14.5 6.5a7 7 0 0 0 0 .5l-.1.2-9 64Zm7.8.8L72 16.8a52 52 0 0 0 5.3 2.2c6.7 2.4 15.7 4.4 25.3 5.8 9.6 1.3 18.7 1.8 25.8 1.4 1.9-.1 3.9-.3 5.8-.7L126.2 82c-1.5 2.2-13.6 5-32 2.4S64.9 75.8 64 73.2ZM75.2 9.6l1.8-.2c5.3-.7 14.6-.8 27.5 1a111.4 111.4 0 0 1 28.3 7.3c-4.7 1-14.8 1.3-29.2-.7-14.5-2-24-5.2-28.4-7.4Zm60.8 59 4.3-30.6a16.8 16.8 0 0 1-4.3 30.6Z"
                  fill="#150D00"
                />
                <path
                  d="M71.9 16.8 64 73.2c.9 2.6 11.8 8.5 30.2 11.1 18.4 2.6 30.5-.1 32-2.4l7.9-56.4c-2 .4-3.9.6-5.8.7-7 .4-16.2 0-25.8-1.4-9.6-1.4-18.6-3.4-25.3-5.8-1.8-.6-3.6-1.4-5.3-2.2Zm5.3 48.6c-4.6-.7-7.9-5-7.2-9.7a2.8 2.8 0 0 1 3-2.4c1.6.2 2.7 1.7 2.4 3.2a3 3 0 1 0 6 .8 2.8 2.8 0 1 1 5.5.8c-.7 4.7-5 8-9.7 7.3Zm24.3-19.9a4.7 4.7 0 1 1 1.4-9.4 4.7 4.7 0 0 1-1.4 9.4Z"
                  fill="#EFDDC9"
                />
                <path
                  d="M70 55.7c-.7 4.7 2.6 9 7.2 9.7 4.7.6 9-2.6 9.7-7.3a2.8 2.8 0 1 0-5.5-.8 3 3 0 1 1-6-.8 2.8 2.8 0 1 0-5.4-.8Z"
                  fill="#150D00"
                />
                <path
                  d="m77 9.4-1.8.2C79.5 11.8 89 15 103.6 17c14.4 2 24.5 1.6 29.2.7l-1.6-.7c-5-2.1-13.9-4.8-26.7-6.6a110.9 110.9 0 0 0-27.5-1Z"
                  fill="#EE8100"
                />
                <path
                  d="M97.5 40.1a4.7 4.7 0 1 0 9.4 1.3c.3-2.5-1.5-5-4-5.3-2.7-.4-5 1.4-5.4 4ZM112.8 147.4l1.5-.3a4.6 4.6 0 0 0 2.8-5.8 102.9 102.9 0 0 1-4.5-49.5 4.5 4.5 0 1 0-9-1.4 110.1 110.1 0 0 0 4.9 54c.7 1.8 2.4 3 4.3 3ZM65.3 143.4l1.1-.1c2.4-.6 4-3.1 3.3-5.5a56 56 0 0 1 0-27.5c2-7.6 5.4-14.9 10.3-21.6 1.5-2 1-4.9-1-6.4-2-1.4-4.9-1-6.4 1C67 91 63.1 99.3 61 108a65 65 0 0 0 0 32c.5 2 2.4 3.4 4.4 3.4ZM58.4 57a4.6 4.6 0 0 0 1.3-9A88 88 0 0 1 9.5 9.5 4.5 4.5 0 0 0 3.2 8a4.6 4.6 0 0 0-1.5 6.3A97.5 97.5 0 0 0 58.4 57Z"
                  fill="#150D00"
                />
              </svg>
              <h2>Leaderboard</h2>
              <Feature />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {voted == true ? <section className="section notification is-success">
    <strong>Congrats</strong>, you have successfully voted.
  </section> : <></> }
  <GalleryMain nfts={nfts} userAddress={userAddress} session={userSession} voted={voted} setVoteState={setVoteState} />
  <section className="info section is-medium is-cozy ">
    <div className="container content">
      <h3>How to vote</h3>
      <ol>
        <li>Connect to your XUMM wallet.</li>
        <li>Vote for your favorite piece (costs 0.000001 XRP + txn fee).</li>
        <li>Once voted, you will receive a confirmation message.</li>
      </ol>
      <p>(1 vote per person)</p>
      <h3>Watch the live stream</h3>
      <p>September 24th @ 2pm EST on Twitch!</p>
      <a href="https://twitch.tv/xrp_cafe" className="button is-primary" target="_window">
        twitch.tv/xrp_cafe
      </a>
      <h3>Winners</h3>
      <p>
        There will be 3 community winners and 1 judges’ winner; the four winners
        will evenly split an XRP, NFTs and tokens prize pool.
      </p>
      <h3>Community</h3>
      <p>
        During the event the community will also be able to win XRP, NFTs and
        tokens by playing Marbles races in our Twitch. Simply type play in the
        Twitch chat to participate.
      </p>
      <h3>Fundraising</h3>
      <p>We will also be fundraising for St. Jude, here:</p>
      <p>
        <a href="https://tiltify.com/@xrp-cafe/secretartevent" className="button is-primary" target="_window">
          Donate to St. Jude
        </a>
      </p>
      <h3>Thanks!</h3>
      <p>
        Thank you to all the projects, judges and community members who make
        this event possible. We hope these events will help bring the community
        together and we plan to host more of these in the future!
      </p>
    </div>
  </section>
  <footer>
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 246 80">
      <path
        d="M203 74a3 3 0 0 1 0-5l39-4a3 3 0 1 1 0 5l-38 4h-1Z"
        fill="#150D00"
      />
      <path d="M203 66a5 5 0 0 1 1 10l-10-4 9-6Z" fill="#EE8100" />
      <path
        d="m204 79-12-4-4-2 4-3c2-2 8-6 11-6l6 1 2 5a7 7 0 0 1-7 9Zm-5-7 5 1a2 2 0 0 0 0-4l-5 3ZM218 28c0 11-2 24-8 26l-2 1h-44l-3-2 2-1 2 1h44c5-2 7-15 7-25s-2-23-7-25l-2-1h-42V1h43l2 1c6 2 8 16 8 26Z"
        fill="#150D00"
      />
      <path
        d="M216 28c0 10-2 23-7 25h-44l-2-1h46l3-7h-2c2-4 3-10 3-17 0-12-3-20-5-21h-39l1 4a92 92 0 0 1 0 34h-1l-3 5-4-1 2-1 1-4a87 87 0 0 0-1-34l-2 18 1 17-3 1-1-1a88 88 0 0 1 0-34c1-4 3-8 6-9h42l2 1c5 2 7 15 7 25Z"
        fill="#150D00"
      />
      <path
        d="M213 28c0 7-1 13-3 17h-40a95 95 0 0 0-1-38h39c2 1 5 9 5 21Z"
        fill="#EFDDC9"
      />
      <path
        d="m212 45-3 7h-44 5l-4-2 3-5h1a41 41 0 0 1-1 5h39c1-1 2-2 2-5h2Z"
        fill="#150D00"
      />
      <path d="M170 45h40c0 3-1 4-2 5h-39l1-4v-1Z" fill="#EE8100" />
      <path d="m166 50 4 2h-5l1-2Z" fill="#150D00" />
      <path d="m166 28-1 16-2 1-1-17a76 76 0 0 1 2-20l2 20Z" fill="#EFDDC9" />
      <path
        d="m166 50-1 2h-2l-2-2 1-1 4 1ZM165 1v1c-3 1-5 5-6 9a88 88 0 0 0 1 35h-2a92 92 0 0 1 0-35c1-5 2-9 6-10h1Z"
        fill="#150D00"
      />
      <path d="M165 44ZM165 44l-1 4a19 19 0 0 1-1-3l2-1Z" fill="#EE8100" />
      <path d="M164 48Z" fill="#fff" />
      <path d="M164 47v1l-2 1-2-1v-2l3-1 1 2Z" fill="#EE8100" />
      <path d="m160 48 2 1-1 1-1-2Z" fill="#EE8100" />
      <path d="m161 50 2 2-2 1-1-2 1-1Z" fill="#150D00" />
      <path
        d="m160 48 1 2-1 1-1-3h1ZM160 48h-1l-1-2h2v2ZM160 51l1 2-4 1 3-3Z"
        fill="#EE8100"
      />
      <path
        d="m160 51-3 3-20-5s-4-2 5-2l17 1 1 3ZM158 46l1 2a323 323 0 0 0-1-2Z"
        fill="#EE8100"
      />
      <path
        d="M157 54c-6 3-14 5-27 4-22-2-32 6-50 12-14 5-72 8-77-1-6-9 5-18 30-16 25 3 62-1 78-4 9-2 21-2 31-2-9 0-5 2-5 2l20 5Z"
        fill="#EE8100"
      />
    </svg>
    <div className="block my my-4">
      © <a href="https://xrp.cafe/">xrp.cafe</a>
    </div>
  </footer>
</>
    );
  }