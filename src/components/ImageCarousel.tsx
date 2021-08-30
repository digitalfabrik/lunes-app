import React, { ReactElement } from 'react'
import { ImagesType } from '../constants/endpoints'
import { useWindowDimensions } from 'react-native'
import { Pagination } from 'react-native-snap-carousel'
import styled from 'styled-components/native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { COLORS } from '../constants/colors'

const ImageView = styled.View`
  height: 35%;
`

const StyledImage = styled.Image`
  height: 100%;
`

const PaginationView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
`

interface ImageCarouselPropsType {
  images: ImagesType
}

interface ItemType {
  source: {
    uri: string
  }
}

interface ImageUrlType {
  url: string
}

const ImageCarousel = ({ images }: ImageCarouselPropsType): ReactElement => {
  const imagesUrls: ImageUrlType[] = images.map(image => ({
    url: image.image
  }))

  const { height: viewportHeight } = useWindowDimensions()

  const renderIndicator = (currentIndex?: number, allSize?: number): JSX.Element => {
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

  const renderItem = (item: ItemType): ReactElement => {
    return <StyledImage source={item.source} accessibilityRole='image' />
  }

  return (
    <ImageView>
      <ImageViewer
        key={imagesUrls.map(elem => elem.url).join()}
        imageUrls={imagesUrls}
        renderImage={renderItem}
        renderIndicator={renderIndicator}
        backgroundColor={COLORS.lunesWhite}
      />
    </ImageView>
  )
}

export default ImageCarousel
