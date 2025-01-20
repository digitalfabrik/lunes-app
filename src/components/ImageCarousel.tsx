import React, { ReactElement } from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import styled, { useTheme } from 'styled-components/native'

import { Images } from '../constants/endpoints'

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

const minimizedPosition = -10
const normalPosition = 10

const Dot = styled.View`
  height: 5px;
  width: 5px;
  background-color: ${props => props.theme.colors.placeholder};
  border-radius: 20px;
  margin: 2px;
`

const ActiveDot = styled(Dot)`
  height: 10px;
  width: 10px;
  background-color: ${props => props.theme.colors.textSecondary};
`

const PaginationView = styled.View<{ minimized: boolean }>`
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: ${({ minimized }) => (minimized ? minimizedPosition : normalPosition)}px;
`

type ImageCarouselProps = {
  images: Images
  minimized?: boolean
}

type Item = {
  source: {
    uri: string
  }
}

type ImageUrl = {
  url: string
}

const ImageCarousel = ({ images, minimized = false }: ImageCarouselProps): ReactElement => {
  const theme = useTheme()
  const { height: deviceHeight } = useWindowDimensions()
  // Manually resize ImageViewer since it doesn't happen automatically on container size changes
  const height = 35
  const percentage = 100
  const heightPercent = minimized ? height / 2 : height
  const viewerHeight = (deviceHeight * heightPercent) / percentage

  const imagesUrls: ImageUrl[] = images.map(image => ({
    url: image.image,
  }))

  const renderIndicator = (currentIndex?: number, allSize?: number): ReactElement => (
    <PaginationView minimized={minimized}>
      {!!allSize &&
        !!currentIndex &&
        allSize > 1 &&
        imagesUrls.map((item, index) =>
          index + 1 === currentIndex ? <ActiveDot key={item.url} /> : <Dot key={item.url} />,
        )}
    </PaginationView>
  )

  const renderItem = (item: Item): ReactElement => (
    <StyledImage source={item.source} minimized={minimized} height={viewerHeight} testID='image' />
  )

  return (
    <ImageView testID='Swipeable' height={viewerHeight}>
      <ImageViewer
        key={imagesUrls.map(elem => elem.url).join()}
        imageUrls={imagesUrls}
        renderImage={renderItem}
        renderIndicator={renderIndicator}
        backgroundColor={theme.colors.backgroundAccent}
        onClick={Keyboard.dismiss}
      />
    </ImageView>
  )
}

export default ImageCarousel
