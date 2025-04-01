import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CheatMode from '../../components/CheatMode'
import ExerciseHeader from '../../components/ExerciseHeader'
import RouteWrapper from '../../components/RouteWrapper'
import {
  BUTTONS_THEME,
  ExerciseKeys,
  FeedbackType,
  numberOfMaxRetries,
  SIMPLE_RESULTS,
  SimpleResult,
} from '../../constants/data'
import useKeyboard from '../../hooks/useKeyboard'
import useRepetitionService from '../../hooks/useRepetitionService'
import { VocabularyItemResult, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray } from '../../services/helpers'
import InteractionSection from './components/InteractionSection'
import RepetitionWriteExerciseService from './services/RepetitionWriteExerciseService'
import StandardWriteExerciseService from './services/StandardWriteExerciseService'

const ButtonContainer = styled.View`
  align-items: center;
`

export type WriteExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>
}

const WriteExerciseScreen = ({ route, navigation }: WriteExerciseScreenProps): ReactElement => {
  const { vocabularyItems, closeExerciseAction, contentType } = route.params
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [vocabularyItemWithResults, setVocabularyItemWithResults] = useState<VocabularyItemResult[]>(
    shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 }))),
  )
  const repetitionService = useRepetitionService()

  const { isKeyboardVisible } = useKeyboard()
  const current = vocabularyItemWithResults[currentIndex]
  const needsToBeRepeated = current.numberOfTries < numberOfMaxRetries && current.result !== SIMPLE_RESULTS.correct

  const writeExerciseService = useMemo(
    () =>
      contentType === 'repetition'
        ? new RepetitionWriteExerciseService(
            route,
            navigation,
            setCurrentIndex,
            setIsAnswerSubmitted,
            setVocabularyItemWithResults,
            repetitionService,
          )
        : new StandardWriteExerciseService(
            route,
            navigation,
            setCurrentIndex,
            setIsAnswerSubmitted,
            setVocabularyItemWithResults,
          ),
    [repetitionService, contentType, route, navigation],
  )

  const initializeExercise = useCallback(
    () => writeExerciseService.initializeExercise(vocabularyItems, vocabularyItemWithResults),
    [vocabularyItems, vocabularyItemWithResults, writeExerciseService],
  )

  useEffect(initializeExercise, [initializeExercise])

  const tryLater = useCallback(() => {
    writeExerciseService.tryLater(currentIndex, isKeyboardVisible, vocabularyItemWithResults)
  }, [isKeyboardVisible, vocabularyItemWithResults, currentIndex, writeExerciseService])

  const storeResult = async (result: VocabularyItemResult): Promise<void> =>
    writeExerciseService.storeResult(result, vocabularyItemWithResults, current, currentIndex)

  const cheatExercise = async (result: SimpleResult): Promise<void> => {
    await writeExerciseService.cheatExercise(result, vocabularyItems, vocabularyItemWithResults)
  }

  const buttonLabel =
    currentIndex === vocabularyItemWithResults.length - 1 && !needsToBeRepeated
      ? getLabels().exercises.showResults
      : getLabels().exercises.next

  return (
    <RouteWrapper>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
        <ExerciseHeader
          navigation={navigation}
          currentWord={currentIndex}
          numberOfWords={vocabularyItems.length}
          closeExerciseAction={closeExerciseAction}
          feedbackType={FeedbackType.vocabularyItem}
          feedbackForId={vocabularyItems[currentIndex].id}
          exerciseKey={ExerciseKeys.writeExercise}
        />

        <InteractionSection
          vocabularyItemWithResult={current}
          storeResult={storeResult}
          isAnswerSubmitted={isAnswerSubmitted}
        />
        <ButtonContainer>
          {isAnswerSubmitted && current.result !== 'similar' ? (
            <Button
              label={buttonLabel}
              iconRight={ArrowRightIcon}
              onPress={() =>
                writeExerciseService.continueExercise(
                  currentIndex,
                  needsToBeRepeated,
                  vocabularyItemWithResults,
                  vocabularyItems,
                  isKeyboardVisible,
                )
              }
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            <>
              <Button
                label={getLabels().exercises.write.showSolution}
                onPress={() => writeExerciseService.giveUp(vocabularyItemWithResults, current, currentIndex)}
                buttonTheme={BUTTONS_THEME.outlined}
              />
              {currentIndex < vocabularyItems.length - 1 && (
                <Button
                  label={getLabels().exercises.tryLater}
                  iconRight={ArrowRightIcon}
                  onPress={tryLater}
                  buttonTheme={BUTTONS_THEME.text}
                />
              )}
            </>
          )}
          <CheatMode cheat={cheatExercise} />
        </ButtonContainer>
      </KeyboardAwareScrollView>
    </RouteWrapper>
  )
}

export default WriteExerciseScreen
