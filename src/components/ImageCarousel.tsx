import React, { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { ImagesType, ImageType } from '../constants/endpoints'
import styled from 'styled-components/native'

const { width: viewportWidth } = Dimensions.get('window')

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
  position: relative;
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

  const renderItem = ({ item }: ItemType) => {
    return <StyledImage source={{ uri: item.image }} testID={'carousel-image'} />
  }

  return (
    <>
      <Carousel
        layout={'default'}
        layoutCardOffset={20}
        data={images}
        renderItem={renderItem}
        onSnapToItem={(index: number) => setActiveImage(index)}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth}
      />
      <Pagination dotsLength={images.length} activeDotIndex={activeImage} containerStyle={styles.container} />
    </>
  )
}

export default ImageCarousel
