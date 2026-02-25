import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import CheatMode from '../../../components/CheatMode'
import ExerciseHeader from '../../../components/ExerciseHeader'
import VocabularyItemImageSection from '../../../components/VocabularyItemImageSection'
import {
  Answer,
  BUTTONS_THEME,
  ExerciseKey,
  NUMBER_OF_MAX_RETRIES,
  SIMPLE_RESULTS,
  SimpleResult,
  FIRST_EXERCISE_FOR_REPETITION,
} from '../../../constants/data'
import { useStorageCache } from '../../../hooks/useStorage'
import { StandardUnitId } from '../../../models/Unit'
import VocabularyItem, { AlternativeWord, VocabularyItemTypes } from '../../../models/VocabularyItem'
import { RoutesParams, VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import { getLabels, moveToEnd, shuffleArray } from '../../../services/helpers'
import { saveExerciseProgress } from '../../../services/storageUtils'
import { SingleChoice } from './SingleChoice'

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.sm};
  flex: 1;
`

type SingleChoiceExerciseProps = {
  vocabularyItems: VocabularyItem[]
  unitId: StandardUnitId | null
  vocabularyItemToAnswer: (vocabularyItem: VocabularyItem) => Answer[]
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  exerciseKey: ExerciseKey
  isRepetitionExercise: boolean
}

const CORRECT_ANSWER_DELAY = 700

const ChoiceExerciseScreen = ({
  vocabularyItems,
  unitId,
  vocabularyItemToAnswer,
  navigation,
  route,
  exerciseKey,
  isRepetitionExercise,
}: SingleChoiceExerciseProps): ReactElement => {
  const storageCache = useStorageCache()
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<VocabularyItemResult[]>(
    shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 }))),
  )
  const { vocabularyItem, numberOfTries, result } = results[currentWord]
  const [answers, setAnswers] = useState<Answer[]>(vocabularyItemToAnswer(vocabularyItem))
  const repetitionService = useRepetitionService()

  const correctAnswers = [
    { word: vocabularyItem.word, article: vocabularyItem.article },
    ...vocabularyItem.alternatives,
  ]
  const needsToBeRepeated = numberOfTries < NUMBER_OF_MAX_RETRIES && result === SIMPLE_RESULTS.incorrect

  const initializeExercise = useCallback(
    (force = false) => {
      if (vocabularyItems.length !== results.length || force) {
        setCurrentWord(0)
        setResults(
          shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 }))),
        )
      }
    },
    [vocabularyItems, results],
  )

  useEffect(initializeExercise, [initializeExercise])

  useEffect(() => setAnswers(vocabularyItemToAnswer(vocabularyItem)), [vocabularyItem, vocabularyItemToAnswer])

  const tryLater = useCallback(() => {
    setResults(moveToEnd(results, currentWord))
  }, [results, currentWord])

  const onExerciseFinished = async (results: VocabularyItemResult[]): Promise<void> => {
    if (unitId !== null) {
      await saveExerciseProgress(storageCache, unitId, exerciseKey, results)
    }
    navigation.navigate('ExerciseFinished', {
      ...route.params,
      exercise: exerciseKey,
      results,
    })
    initializeExercise(true)
  }
  const count = vocabularyItems.length

  const onExerciseCheated = async (result: SimpleResult): Promise<void> => {
    const cheatedResults = results.map(it => ({
      ...it,
      numberOfTries: result === SIMPLE_RESULTS.correct ? 1 : NUMBER_OF_MAX_RETRIES,
      result,
    }))
    await onExerciseFinished(cheatedResults)
    if (isRepetitionExercise) {
      await repetitionService.updateSeveralWordNodeCards(cheatedResults)
    }
  }

  const isAnswerEqual = (answer1: Answer | AlternativeWord, answer2: Answer | null): boolean =>
    answer2 != null && answer1.article.id === answer2.article.id && answer1.word === answer2.word

  const updateResult = async (numberOfTries: number, isCorrect: boolean): Promise<void> => {
    const result = isCorrect ? SIMPLE_RESULTS.correct : SIMPLE_RESULTS.incorrect
    const newResults = [...results]
    newResults[currentWord] = { ...newResults[currentWord], numberOfTries, result }
    setResults(newResults)
    if (isCorrect || numberOfTries >= NUMBER_OF_MAX_RETRIES) {
      await repetitionService.updateWordNodeCard(newResults[currentWord])
    }
  }

  const onClickAnswer = async (clickedAnswer: Answer): Promise<void> => {
    setSelectedAnswer(clickedAnswer)

    const isCorrect = correctAnswers.some(it => isAnswerEqual(it, clickedAnswer))
    await updateResult(numberOfTries + 1, isCorrect)

    if (exerciseKey >= FIRST_EXERCISE_FOR_REPETITION && !isCorrect) {
      const repetitionService = RepetitionService.fromStorageCache(storageCache)
      await repetitionService.addWordToFirstSection(vocabularyItem)
    }

    setTimeout(() => {
      setDelayPassed(true)
    }, CORRECT_ANSWER_DELAY)
  }

  const onFinishWord = async (): Promise<void> => {
    const exerciseFinished = currentWord + 1 >= count && !needsToBeRepeated

    if (exerciseFinished) {
      await onExerciseFinished(results)
    } else if (needsToBeRepeated) {
      tryLater()
    } else {
      setCurrentWord(prevState => prevState + 1)
    }
    setSelectedAnswer(null)
    setDelayPassed(false)
  }

  const lastWord = currentWord + 1 >= count
  const buttonLabel = lastWord && !needsToBeRepeated ? getLabels().exercises.showResults : getLabels().exercises.next

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        closeExerciseAction={route.params.closeExerciseAction}
        currentWord={currentWord}
        numberOfWords={count}
        feedbackTarget={
          vocabularyItem.id.type === VocabularyItemTypes.Standard
            ? { type: 'word', wordId: vocabularyItem.id }
            : undefined
        }
        exerciseKey={exerciseKey}
      />

      <ScrollView>
        <VocabularyItemImageSection vocabularyItem={vocabularyItem} audioDisabled={selectedAnswer === null} />
        <SingleChoice
          answers={answers}
          isAnswerEqual={isAnswerEqual}
          onClick={onClickAnswer}
          correctAnswers={correctAnswers}
          selectedAnswer={selectedAnswer}
          delayPassed={delayPassed}
        />
        <ButtonContainer>
          {selectedAnswer !== null ? (
            <Button
              label={buttonLabel}
              iconRight={ArrowRightIcon}
              onPress={onFinishWord}
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            !lastWord && (
              <Button
                label={getLabels().exercises.tryLater}
                iconRight={ArrowRightIcon}
                onPress={tryLater}
                buttonTheme={BUTTONS_THEME.text}
              />
            )
          )}
          <CheatMode cheat={onExerciseCheated} />
        </ButtonContainer>
      </ScrollView>
    </>
  )
}

export default ChoiceExerciseScreen
