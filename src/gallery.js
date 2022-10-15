import React from "react";
import PropTypes from "prop-types";
import { Box, Flex, Center, Text, Link, Button, Image } from "@chakra-ui/react";
import { CheckIcon } from '@chakra-ui/icons'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import GLBObject from './glbobject.js'

const GalleryPicker = (props) => {
  const [images, setImages] = React.useState([]);
  const { nftArray, userAddress, votecallback } = props;

  const VoteClick = (tokenId) => {
        votecallback(tokenId);
  };

  React.useEffect(() => {
    let imageList = [];
    let nftList = nftArray.map(function (image, i) {
      let imgSrc = image.imageURL;
      if (imgSrc == undefined) {
        imgSrc = "images/noImage.png";
      }
      return {
        src: imgSrc,
        name: '#' + image.token_id,
        token_id: image.token_id
      };
    });

    nftList.forEach((el, i) => {
      imageList.push({
        id: i,
        src: el.src,
        selected: false,
        title: "",
        name: el.name,
        token_id: el.token_id
      });
    });
    setImages(imageList);
  }, []);

  const onImageClick = (id) => {
    let imageList = [...images];

    for (const img of imageList) {
      img.selected = false;
    }

    for (const img of imageList) {
      if (img.id === id) {
       // returnImage(img, nftArray[id]);
        img.selected = !img.selected;
      }
    }
  };

  const divStyle = {
    marginLeft: "30px",
    marginTop: "30px",
  };

  return (
    <>
      {images.map((img, i) => (
                  <li>
                    {img.src.includes('.gltf') ? <GLBObject /> : <></>}
                    {img.src.includes('.mp4') ? <video controls className="video"><source src={img.src} type="video/mp4" preload="none" /></video> : <></>}
                    {!img.src.includes('.mp4') && !img.src.includes('.gltf') ? <Zoom>
                    <picture>
                        <source srcSet={img.src} />
                        <Image
                                rounded={'lg'}
                                objectFit={'cover'}
                                src={img.src}
                            />
                    </picture>
                </Zoom> : <></>}
                <p>{img.name}</p>

   {userAddress != '' && props.voted == false ? <button className="button" onClick={() => { VoteClick(img.token_id) }}>Vote</button> : <></> }
  {userAddress != '' && props.voted == true ? <p>Thanks for voting!</p> : <></> }
                  </li>
      ))}
    </>
  );
};
GalleryPicker.propTypes = {
  nftArray: PropTypes.array.isRequired,
  userAddress: PropTypes.string.isRequired,
  votecallback: PropTypes.func.isRequired
};

export default GalleryPicker;
