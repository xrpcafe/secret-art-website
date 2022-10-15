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
    Box,
    Spinner
  } from '@chakra-ui/react';
  import React, { useState, useEffect } from "react";
export default function Feature() {
    const [top, setTop] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const getTop5 = async () => {
        try {
          let response = await fetch(process.env.REACT_APP_PROXY_ENDPOINT + '/api/top5', {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
          });
          let json = await response.json()
          return json;
        } catch (error) {
          return [];
        }
      }

    useEffect(async () => {
        let top5 = await getTop5();
        setTop(top5);
        setIsLoading(false)
      }, []);
    return (

      <div className="scroll">
                <ol>
                {isLoading ? <Spinner marginTop="30px" /> : <></>}
        {top.map((obj, i) => (
            <li><span> #{obj.Vote}</span> (Vote Count: {obj.VoteCount})</li>
        ))}
                </ol>
              </div>
    )
  }