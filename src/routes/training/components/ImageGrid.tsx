import React, { ReactElement, useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import styled, { css } from 'styled-components/native'

import PressableOpacity from '../../../components/PressableOpacity'
import theme from '../../../constants/theme'
import { VocabularyItemId } from '../../../models/VocabularyItem'

const Grid = styled(View)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const StyledImage = styled.Image<{ width: number; padding: number; state: ImageGridItem['state'] }>`
  aspect-ratio: 1;
  width: ${props => props.width}px;
  margin: ${props => props.padding}px;
  border-radius: ${props => props.theme.spacings.xxs};
  ${props =>
    props.state === 'correct' &&
    css`
      border-color: ${props.theme.colors.correct};
    `}
  ${props =>
    props.state === 'incorrect' &&
    css`
      border-color: ${props.theme.colors.incorrect};
    `}
  ${props =>
    props.state !== 'default' &&
    css`
      border-width: ${props.theme.spacings.xxs};
    `}
`

export type ImageGridItem = {
  src: string
  key: VocabularyItemId
  state: 'default' | 'correct' | 'incorrect'
}

type ImageGridProps = {
  items: ImageGridItem[]
  onPress: (key: VocabularyItemId) => void
}

const NUM_COLUMNS = 2

// Looks like there is no built-in away to create a responsive grid in react native, so let's do some manual layout...
const ImageGrid = ({ items, onPress }: ImageGridProps): ReactElement => {
  const [availableWidth, setAvailableWidth] = useState(0)
  const paddingPx = theme.spacingsPlain.xs
  // let's be a bit defensive here so that there are no unwanted overflows in the flow layout
  const imageWidth = Math.floor((availableWidth - 2 * NUM_COLUMNS * paddingPx) / NUM_COLUMNS - 1)

  const onGridLayout = (event: LayoutChangeEvent): void => {
    if (availableWidth !== event.nativeEvent.layout.width) {
      setAvailableWidth(event.nativeEvent.layout.width)
    }
  }

  return (
    <Grid onLayout={onGridLayout}>
      {items.map(item => (
        <PressableOpacity key={JSON.stringify(item.key)} onPress={() => onPress(item.key)}>
          <StyledImage src={item.src} width={imageWidth} padding={paddingPx} state={item.state} testID='imageOption' />
        </PressableOpacity>
      ))}
    </Grid>
  )
}

export default ImageGrid
