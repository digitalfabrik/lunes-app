import React from 'react'
import { useWindowDimensions, View } from 'react-native'
import { ImagesType } from '../constants/endpoints'
import styled from 'styled-components/native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { COLORS } from '../constants/colors'
import { Pagination } from 'react-native-snap-carousel'

const StyledImage = styled.Image`
  height: 100%;
`

const PaginationView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: -10;
  background-color: transparent;
`

interface ImageCarouselPropsType {
  images: ImagesType
}

interface ImageUrlType {
  url: string
}

const ImageCarousel = ({ images }: ImageCarouselPropsType) => {
  const imagesUrls: ImageUrlType[] = []
  images.forEach(it => imagesUrls.push({ url: it.image }))
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions()
  console.log(viewportWidth)

  const renderIndicator = (currentIndex?: number, allSize?: number) => {
    return !currentIndex || !allSize ? (
      <></>
    ) : (
      <PaginationView>
        <Pagination
          activeDotIndex={currentIndex - 1}
          dotsLength={allSize}
          dotStyle={{ backgroundColor: COLORS.lunesBlack }}
        />
      </PaginationView>
    )
  }

  const renderItem = (props: any) => {
    const { source } = props
    return <StyledImage source={source} />
  }

  return (
    <View style={{ height: 0.4 * viewportHeight, width: 1.5 * viewportWidth, marginLeft: -105 }}>
      <ImageViewer
        imageUrls={imagesUrls}
        renderImage={renderItem}
        renderIndicator={renderIndicator}
        backgroundColor={COLORS.lunesWhite}
      />
    </View>
  )
}

export default ImageCarousel
