import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NextArrow, WhiteNextArrow } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME, SimpleResultType } from '../../../constants/data'
import labels from '../../../constants/labels.json'

export const LightLabelInput = styled.Text<{ styledInput?: string }>`
  text-align: center;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  color: ${prop =>
    prop.styledInput ? props => props.theme.colors.lunesBlackLight : props => props.theme.colors.lunesWhite};
`

const LightLabelArrow = styled(LightLabelInput)`
  margin-right: 8px;
`

const DarkLabel = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`
const StyledArrow = styled(NextArrow)`
  margin-left: 5px;
`

export interface IActionsProps {
  tryLater: () => void
  giveUp: () => void
  result: SimpleResultType | null
  checkEntry: () => void
  continueExercise: () => void
  input: string
  isFinished: boolean
  secondAttempt: boolean
}

const Actions = ({
  result,
  giveUp,
  checkEntry,
  continueExercise,
  input,
  isFinished,
  tryLater
}: IActionsProps): ReactElement => {
  return result === 'correct' || result === 'incorrect' ? (
    <Button onPress={continueExercise} buttonTheme={BUTTONS_THEME.dark} testID={isFinished ? 'check-out' : 'next-word'}>
      <LightLabelArrow>{isFinished ? labels.exercises.showResults : labels.exercises.next}</LightLabelArrow>
      <WhiteNextArrow />
    </Button>
  ) : (
    <>
      <Button onPress={checkEntry} disabled={!input} buttonTheme={BUTTONS_THEME.dark} testID='check-entry'>
        <LightLabelInput styledInput={input}>{labels.exercises.write.checkInput}</LightLabelInput>
      </Button>

      <Button onPress={giveUp} buttonTheme={BUTTONS_THEME.light} testID='give-up'>
        <DarkLabel>{labels.exercises.write.showSolution}</DarkLabel>
      </Button>

      {!isFinished && (
        <Button onPress={tryLater} testID='try-later'>
          <DarkLabel>{labels.exercises.tryLater}</DarkLabel>
          <StyledArrow />
        </Button>
      )}
    </>
  )
}

export default Actions
