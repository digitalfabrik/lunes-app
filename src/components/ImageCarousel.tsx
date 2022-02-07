import React, { ReactElement } from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Pagination } from 'react-native-snap-carousel'
import styled from 'styled-components/native'

import { Images } from '../constants/endpoints'
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

interface ImageCarouselProps {
  images: Images
  minimized?: boolean
}

interface Item {
  source: {
    uri: string
  }
}

interface ImageUrl {
  url: string
}

const ImageCarousel = ({ images, minimized = false }: ImageCarouselProps): ReactElement => {
  const { height: deviceHeight } = useWindowDimensions()
  // Manually resize ImageViewer since it doesn't happen automatically on container size changes
  const heightPercent = minimized ? 35 / 2 : 35
  const viewerHeight = (deviceHeight * heightPercent) / 100

  const imagesUrls: ImageUrl[] = images.map(image => ({
    url: image.image
  }))

  const renderIndicator = (currentIndex?: number, allSize?: number): ReactElement =>
    currentIndex && allSize ? (
      <PaginationView minimized={minimized}>
        <Pagination
          activeDotIndex={currentIndex - 1}
          dotsLength={allSize}
          dotStyle={{ backgroundColor: COLORS.lunesBlack }}
        />
      </PaginationView>
    ) : (
      <></>
    )

  const renderItem = (item: Item): ReactElement => (
    <StyledImage source={item.source} accessibilityRole='image' minimized={minimized} height={viewerHeight} />
  )

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
