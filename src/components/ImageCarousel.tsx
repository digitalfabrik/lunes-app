import React, { Component } from 'react'
import { Text } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { ImagesType } from '../constants/endpoints'
import styled from 'styled-components/native'

export const sliderWidth = 392
export const itemWidth = 311

const StyledImage = styled.Image`
  width: 100%;
  height: 35%;
  position: relative;
`

interface ImageCarouselPropsType {
  images: ImagesType
}

const ImageCarousel = ({ images }: ImageCarouselPropsType) => {
  const renderItem = ({ item, index }) => {
    return (
      <StyledImage
        source={{
          uri: item.image
        }}
      />
    )
  }

  return <Carousel data={images} renderItem={renderItem} sliderWidth={sliderWidth} itemWidth={itemWidth} />
}

export default ImageCarousel
