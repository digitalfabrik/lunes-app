import React, { ReactElement } from 'react'
import styled, { css } from 'styled-components/native'

import PressableOpacity from '../../../components/PressableOpacity'
import { ContentText } from '../../../components/text/Content'

type WordContainerState = 'enabled' | 'disabled' | 'wrong' | 'hidden'
export type SelectedWord = { word: string; index: number; state: WordContainerState }

export const WordsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${props => props.theme.spacings.xs};
  gap: ${props => props.theme.spacings.xxs};
`

const SingleWordContainer = styled(ContentText)<{ state: WordContainerState }>`
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  ${props =>
    props.state === 'hidden' &&
    css`
      opacity: 0;
    `}
  ${props =>
    props.state === 'enabled' &&
    css`
      background-color: ${props.theme.colors.buttonBlue};
    `}
  ${props =>
    props.state === 'disabled' &&
    css`
      background-color: ${props.theme.colors.disabled};
      text-decoration-line: line-through;
    `}
  ${props =>
    props.state === 'wrong' &&
    css`
      background-color: ${props.theme.colors.trainingIncorrect};
    `}
`

type WordSelectorProps = {
  words: SelectedWord[]
  onPress: (index: number) => void
  testID?: string
}

const WordsSelector = ({ words, onPress, testID }: WordSelectorProps): ReactElement => (
  <WordsContainer testID={testID}>
    {words.map(({ word, state, index }) => (
      <PressableOpacity
        key={index}
        onPress={() => onPress(index)}
        disabled={state === 'disabled' || state === 'hidden'}>
        <SingleWordContainer state={state}>{word}</SingleWordContainer>
      </PressableOpacity>
    ))}
  </WordsContainer>
)

export default WordsSelector
