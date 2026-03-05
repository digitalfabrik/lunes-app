import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import theme from '../constants/theme'
import { getLabels } from '../services/helpers'
import BottomSheet from './BottomSheet'
import { HeadingText } from './text/Heading'

const BottomSheetColumn = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-items: center;
  align-self: stretch;
`

const BottomSheetRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const BottomSheetWordContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundTransparent};
  padding: ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  width: 100%;
`

type WordResultIndicatorProps = {
  isVisible: boolean
  isCorrect: boolean
  content: ReactElement
  button: ReactElement
}
const WordResultIndicator = ({ isVisible, isCorrect, content, button }: WordResultIndicatorProps): ReactElement => {
  const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon
  const color = isCorrect ? theme.colors.trainingCorrect : theme.colors.trainingIncorrect

  return (
    <BottomSheet visible={isVisible} backgroundColor={color}>
      <BottomSheetColumn>
        <BottomSheetRow>
          <Icon width='32' height='32' />
          <HeadingText>
            {isCorrect
              ? getLabels().exercises.training.sentence.correct
              : getLabels().exercises.training.sentence.incorrect}
          </HeadingText>
        </BottomSheetRow>

        <BottomSheetColumn>
          <BottomSheetWordContainer>{content}</BottomSheetWordContainer>
        </BottomSheetColumn>

        {button}
      </BottomSheetColumn>
    </BottomSheet>
  )
}

export default WordResultIndicator
