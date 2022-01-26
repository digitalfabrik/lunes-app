import React, { ReactElement } from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Pagination } from 'react-native-snap-carousel'
import styled from 'styled-components/native'

import { Images } from '../constants/endpoints'
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

interface ImageCarouselProps {
  images: Images
}
interface Item {
  source: {
    uri: string
  }
}
interface ImageUrl {
  url: string
}

const ImageCarousel = ({ images }: ImageCarouselProps): ReactElement => {
  const imagesUrls: ImageUrl[] = images.map(image => ({
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

  const renderItem = (item: Item): ReactElement => {
    return <StyledImage source={item.source} accessibilityRole='image' />
  }

  return (
    <ImageView testID={'Swipeable'}>
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
