import React, { ReactElement } from 'react'
import { WhiteNextArrow, NextArrow } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { COLORS } from '../../../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import labels from '../../../constants/labels.json'
import styled from 'styled-components/native'

const LightLabelArrow = styled.Text`
  text-align: center;
  color: ${COLORS.lunesWhite};
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${wp('4%')};
  letter-spacing: 0.4;
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 8;
`
export const LightLabelInput = styled.Text`
  text-align: center;
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${wp('4%')};
  letter-spacing: 0.4;
  text-transform: uppercase;
  font-weight: 600;
  color: ${(prop: StyledProps) => (prop.styledInput ? COLORS.lunesBlackLight : COLORS.lunesWhite)};
`
const DarkLabel = styled.Text`
  text-align: center;
  color: ${COLORS.lunesBlack};
  font-family: 'SourceSansPro-SemiBold';
  font-size: ${wp('4%')};
  letter-spacing: 0.4;
  text-transform: uppercase;
  font-weight: 600;
`
const StyledArrow = styled(NextArrow)`
  margin-left: 5;
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
    <Button onPress={getNextWord} theme={BUTTONS_THEME.dark} testID={isFinished ? 'check-out' : 'next-word'}>
      <>
        <LightLabelArrow>{isFinished ? labels.exercises.showResults : labels.exercises.next}</LightLabelArrow>
        <WhiteNextArrow />
      </>
    </Button>
  ) : (
    <>
      <Button onPress={checkEntry} disabled={!input} theme={BUTTONS_THEME.dark} testID='check-entry'>
        <LightLabelInput styledInput={input}>{labels.exercises.write.checkInput}</LightLabelInput>
      </Button>

      <Button onPress={giveUp} theme={BUTTONS_THEME.light} testID='give-up'>
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
