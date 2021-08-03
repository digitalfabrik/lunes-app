import React, { useState } from 'react'
import { Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { ImagesType, ImageType } from '../constants/endpoints'
import styled from 'styled-components/native'

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
  position: relative;
`

const Container = styled.View`
  height: 35%;
`

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginTop: -10,
    alignSelf: 'center'
  }
})

interface ImageCarouselPropsType {
  images: ImagesType
}

interface ItemType {
  item: ImageType
}

const ImageCarousel = ({ images }: ImageCarouselPropsType) => {
  const [activeImage, setActiveImage] = useState(0)
  const { width: viewportWidth } = useWindowDimensions()

  const renderItem = ({ item }: ItemType) => {
    return <StyledImage source={{ uri: item.image }} accessibilityRole='image' />
  }

  return (
    <Container>
      <Carousel
        layout={'default'}
        layoutCardOffset={20}
        data={images}
        renderItem={renderItem}
        onSnapToItem={setActiveImage}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
      />
      <Pagination dotsLength={images.length} activeDotIndex={activeImage} containerStyle={styles.container} />
    </Container>
  )
}

export default ImageCarousel
