import React, { ReactElement } from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Pagination } from 'react-native-snap-carousel'
import styled from 'styled-components/native'

import { ImagesType } from '../constants/endpoints'
import { COLORS } from '../constants/theme/colors'

const ImageView = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
`
const StyledImage = styled.Image<{ height: number; minimized: boolean }>`
  height: ${({ height }) => height}px;
  /* center image because resizeMode doesn't work for ios */
  ${({ minimized }) =>
    minimized &&
    `
    aspect-ratio: 1.5;
    margin: 0 auto;
  `}
`
const PaginationView = styled.View<{ minimized: boolean }>`
  position: absolute;
  left: 0px;
  right: 0px;
  top: ${({ minimized }) => (minimized ? -10 : 10)}px;
`

interface ImageCarouselPropsType {
  images: ImagesType
  minimized?: boolean
}

interface ItemType {
  source: {
    uri: string
  }
}

interface ImageUrlType {
  url: string
}

const ImageCarousel = ({ images, minimized = false }: ImageCarouselPropsType): ReactElement => {
  const { height: deviceHeight } = useWindowDimensions()
  // Manually resize ImageViewer since it doesn't happen automatically on container size changes
  const heightPercent = minimized ? 35 / 2 : 35
  const viewerHeight = (deviceHeight * heightPercent) / 100

  const imagesUrls: ImageUrlType[] = images.map(image => ({
    url: image.image
  }))

  const renderIndicator = (currentIndex?: number, allSize?: number): ReactElement => {
    return !currentIndex || !allSize ? (
      <></>
    ) : (
      <PaginationView minimized={minimized}>
        <Pagination
          activeDotIndex={currentIndex - 1}
          dotsLength={allSize}
          dotStyle={{ backgroundColor: COLORS.lunesBlack }}
        />
      </PaginationView>
    )
  }

  const renderItem = (item: ItemType): ReactElement => {
    return <StyledImage source={item.source} accessibilityRole='image' minimized={minimized} height={viewerHeight} />
  }

  return (
    <ImageView testID={'Swipeable'} height={viewerHeight}>
      <ImageViewer
        key={imagesUrls.map(elem => elem.url).join()}
        imageUrls={imagesUrls}
        renderImage={renderItem}
        renderIndicator={renderIndicator}
        backgroundColor={COLORS.lunesWhite}
        onClick={Keyboard.dismiss}
      />
    </ImageView>
  )
}

export default ImageCarousel
