import React, { ReactElement } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Pagination } from 'react-native-snap-carousel'
import styled from 'styled-components/native'

import { ImagesType } from '../constants/endpoints'
import { COLORS } from '../constants/theme/colors'

const ImageView = styled.View`
  height: 35%;
`
const StyledImage = styled.Image`
  height: 100%;
`
const PaginationView = styled.View`
  position: absolute;
  left: 0px;
  right: 0px;
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

  const renderIndicator = (currentIndex?: number, allSize?: number): ReactElement => {
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
