import React, { ReactElement, useState } from 'react'
import { useWindowDimensions, View } from 'react-native'
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view'
import styled, { useTheme } from 'styled-components/native'

const VIEWER_HEIGHT_PERCENT = 0.35

const ImageViewContainer = styled.View<{ height: number }>`
  height: ${({ height }) => height}px;
`

const StyledPagerView = styled(PagerView)`
  flex: 1;
  background-color: ${props => props.theme.colors.backgroundAccent};
`
const StyledImage = styled.Image`
  height: 100%;
`

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

const IndicatorView = styled.View`
  width: 100%;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: ${props => props.theme.spacings.xs};
`

type ImageCarouselProps = {
  images: string[]
}

const ImageCarousel = ({ images }: ImageCarouselProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState(0)
  const theme = useTheme()
  const { height: deviceHeight } = useWindowDimensions()
  const viewerHeight = deviceHeight * VIEWER_HEIGHT_PERCENT

  const onPageSelected = (event: PagerViewOnPageSelectedEvent): void => {
    setCurrentPage(event.nativeEvent.position)
  }

  const indicator = (
    <IndicatorView>
      {images.length > 1 &&
        images.map((url, index) => (index === currentPage ? <ActiveDot key={url} /> : <Dot key={url} />))}
    </IndicatorView>
  )

  const renderItem = (url: string): ReactElement => (
    <View key={url}>
      <StyledImage src={url} testID='image' resizeMode='contain' />
    </View>
  )

  return (
    <ImageViewContainer height={viewerHeight}>
      <StyledPagerView initialPage={0} onPageSelected={onPageSelected} pageMargin={theme.spacingsPlain.sm}>
        {images.map(renderItem)}
      </StyledPagerView>
      {indicator}
    </ImageViewContainer>
  )
}

export default ImageCarousel
