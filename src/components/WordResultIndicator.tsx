import React, { ReactElement } from 'react'
import styled, { css } from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../assets/images'
import theme from '../constants/theme'
import { VocabularyItemId } from '../models/VocabularyItem'
import BottomSheet from './BottomSheet'
import VocabularyNotePreview from './VocabularyNotePreview'
import { HeadingText } from './text/Heading'
import { Hint } from './text/Hint'

const BottomSheetColumn = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-items: center;
  align-self: stretch;
  gap: ${props => props.theme.spacings.md};
`

const BottomSheetRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const sheetContentInset = css`
  align-self: stretch;
  margin: 0 ${props => props.theme.spacings.xs};
`

const BottomSheetWordContainer = styled.View`
  ${sheetContentInset};
  background-color: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
`

const NoteContainer = styled.View`
  ${sheetContentInset};
`

const FeedbackText = styled(Hint)`
  text-align: center;
  color: ${props => props.theme.colors.primary};
`

type WordResultIndicatorProps = {
  isVisible: boolean
  isCorrect: boolean
  label: string
  content: ReactElement | null
  wordId: VocabularyItemId
  button: ReactElement
  hint?: string
}
const WordResultIndicator = ({
  isVisible,
  isCorrect,
  label,
  content,
  wordId,
  button,
  hint,
}: WordResultIndicatorProps): ReactElement => {
  const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon
  const color = isCorrect ? theme.colors.trainingCorrect : theme.colors.trainingIncorrect

  return (
    <BottomSheet visible={isVisible} backgroundColor={color}>
      <BottomSheetColumn>
        <BottomSheetRow>
          <Icon width='32' height='32' color={theme.colors.text} accessible={false} />
          <HeadingText>{label}</HeadingText>
        </BottomSheetRow>

        {content && <BottomSheetWordContainer>{content}</BottomSheetWordContainer>}

        <NoteContainer>
          <VocabularyNotePreview wordId={wordId} />
        </NoteContainer>

        {hint !== undefined && <FeedbackText>{hint}</FeedbackText>}

        {button}
      </BottomSheetColumn>
    </BottomSheet>
  )
}

export default WordResultIndicator
