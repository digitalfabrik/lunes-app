import React from 'react'
import { useWindowDimensions } from 'react-native'
import { ImagesType } from '../constants/endpoints'
import styled from 'styled-components/native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { COLORS } from '../constants/colors'
import { Pagination } from 'react-native-snap-carousel'

const ImageView = styled.View<{ viewportHeight: number }>`
  height: ${props => 0.4 * props.viewportHeight}px;
`

const StyledImage = styled.Image`
  height: 100%;
`

const PaginationView = styled.View<{ viewportHeight: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${props => props.viewportHeight * -0.01}px;
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
  const { height: viewportHeight } = useWindowDimensions()

  const renderIndicator = (currentIndex?: number, allSize?: number) => {
    return !currentIndex || !allSize ? (
      <></>
    ) : (
      <PaginationView viewportHeight={viewportHeight}>
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
    <ImageView viewportHeight={viewportHeight}>
      <ImageViewer
        imageUrls={imagesUrls}
        renderImage={renderItem}
        renderIndicator={renderIndicator}
        backgroundColor={COLORS.lunesWhite}
      />
    </ImageView>
  )
}

export default ImageCarousel
