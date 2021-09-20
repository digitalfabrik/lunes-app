import React, { ReactElement } from 'react'
import { WhiteNextArrow, NextArrow } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import labels from '../../../constants/labels.json'
import styled from 'styled-components/native'

export const LightLabelInput = styled.Text`
  text-align: center;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${wp('4%')}px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-weight: 600;
  color: ${(prop: StyledProps) => (prop.styledInput ? props => props.theme.colors.lunesBlackLight : props => props.theme.colors.lunesWhite)};
`

const LightLabelArrow = styled(LightLabelInput)`
  margin-right: 8px;
`

const DarkLabel = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${wp('4%')}px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  font-weight: 600;
`
const StyledArrow = styled(NextArrow)`
  margin-left: 5px;
`
export interface IActionsProps {
  tryLater: () => void
  giveUp: () => void
  result: string
  checkEntry: () => void
  getNextWord: () => void
  input: string
  isFinished: boolean
  secondAttempt: boolean
}

interface StyledProps {
  styledInput?: string
}

const Actions = ({
  result,
  giveUp,
  checkEntry,
  getNextWord,
  input,
  isFinished,
  tryLater
}: IActionsProps): ReactElement => {
  return result ? (
    <Button onPress={getNextWord} buttonTheme={BUTTONS_THEME.dark} testID={isFinished ? 'check-out' : 'next-word'}>
      <>
        <LightLabelArrow>{isFinished ? labels.exercises.showResults : labels.exercises.next}</LightLabelArrow>
        <WhiteNextArrow />
      </>
    </Button>
  ) : (
    <>
      <Button onPress={checkEntry} disabled={!input} buttonTheme={BUTTONS_THEME.dark} testID='check-entry'>
        <LightLabelInput styledInput={input}>{labels.exercises.write.checkInput}</LightLabelInput>
      </Button>

      <Button onPress={giveUp} buttonTheme={BUTTONS_THEME.light} testID='give-up'>
        <DarkLabel>{labels.exercises.write.showSolution}</DarkLabel>
      </Button>

      {!isFinished && !result && (
        <Button onPress={tryLater} testID='try-later'>
          <>
            <DarkLabel>{labels.exercises.write.tryLater}</DarkLabel>
            <StyledArrow />
          </>
        </Button>
      )}
    </>
  )
}

export default Actions
