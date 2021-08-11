import React, { ReactElement } from 'react'
import { Text, StyleSheet } from 'react-native'
import { WhiteNextArrow, NextArrow } from '../../../../assets/images'
import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import { COLORS } from '../../../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import labels from '../../../constants/labels.json'

export const styles = StyleSheet.create({
  lightLabel: {
    textAlign: 'center',
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  darkLabel: {
    textAlign: 'center',
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  disabledButtonLabel: {
    color: COLORS.lunesBlackLight
  },
  arrowLabel: {
    marginRight: 8
  },
  arrow: {
    marginLeft: 5
  }
})

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
        <Text style={[styles.lightLabel, styles.arrowLabel]}>
          {isFinished ? labels.exercises.showResults : labels.exercises.next}
        </Text>
        <WhiteNextArrow />
      </>
    </Button>
  ) : (
    <>
      <Button onPress={checkEntry} disabled={!input} theme={BUTTONS_THEME.dark} testID='check-entry'>
        <Text style={[styles.lightLabel, !input && styles.disabledButtonLabel]}>
          {labels.exercises.write.checkInput}
        </Text>
      </Button>

      <Button onPress={giveUp} theme={BUTTONS_THEME.light} testID='give-up'>
        <Text style={styles.darkLabel}>{labels.exercises.write.showSolution}</Text>
      </Button>

      {!isFinished && !result && (
        <Button onPress={tryLater} testID='try-later'>
          <>
            <Text style={styles.darkLabel}>{labels.exercises.write.tryLater}</Text>
            <NextArrow style={styles.arrow} />
          </>
        </Button>
      )}
    </>
  )
}

export default Actions
