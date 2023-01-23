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
  FeedbackType,
  numberOfMaxRetries,
  SIMPLE_RESULTS,
  SimpleResult,
} from '../../../constants/data'
import { AlternativeWord, VocabularyItem } from '../../../constants/endpoints'
import { VocabularyItemResult, RoutesParams } from '../../../navigation/NavigationTypes'
import { getExerciseProgress, saveExerciseProgress } from '../../../services/AsyncStorage'
import { calculateScore, getLabels, moveToEnd, shuffleArray, willNextExerciseUnlock } from '../../../services/helpers'
import { SingleChoice } from './SingleChoice'

const ButtonContainer = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.sm};
  flex: 1;
`

type SingleChoiceExerciseProps = {
  vocabularyItems: VocabularyItem[]
  disciplineId: number
  disciplineTitle: string
  vocabularyItemToAnswer: (vocabularyItem: VocabularyItem) => Answer[]
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: ExerciseKey
}

const CORRECT_ANSWER_DELAY = 700

const ChoiceExerciseScreen = ({
  vocabularyItems,
  disciplineId,
  disciplineTitle,
  vocabularyItemToAnswer,
  navigation,
  route,
  exerciseKey,
}: SingleChoiceExerciseProps): ReactElement => {
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<VocabularyItemResult[]>(
    shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 })))
  )
  const { vocabularyItem, numberOfTries, result } = results[currentWord]
  const [answers, setAnswers] = useState<Answer[]>(vocabularyItemToAnswer(vocabularyItem))

  const correctAnswers = [
    { word: vocabularyItem.word, article: vocabularyItem.article },
    ...vocabularyItem.alternatives,
  ]
  const needsToBeRepeated = numberOfTries < numberOfMaxRetries && result === SIMPLE_RESULTS.incorrect

  const initializeExercise = useCallback(
    (force = false) => {
      if (vocabularyItems.length !== results.length || force) {
        setCurrentWord(0)
        setResults(
          shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 })))
        )
      }
    },
    [vocabularyItems, results]
  )

  useEffect(initializeExercise, [initializeExercise])

  useEffect(() => setAnswers(vocabularyItemToAnswer(vocabularyItem)), [vocabularyItem, vocabularyItemToAnswer])

  const tryLater = useCallback(() => {
    setResults(moveToEnd(results, currentWord))
  }, [results, currentWord])

  const onExerciseFinished = async (results: VocabularyItemResult[]): Promise<void> => {
    const progress = await getExerciseProgress()
    await saveExerciseProgress(disciplineId, exerciseKey, results)
    navigation.navigate('ExerciseFinished', {
      vocabularyItems,
      disciplineId,
      disciplineTitle,
      exercise: exerciseKey,
      results,
      closeExerciseAction: route.params.closeExerciseAction,
      unlockedNextExercise: willNextExerciseUnlock(progress[disciplineId]?.[exerciseKey], calculateScore(results)),
    })
    initializeExercise(true)
  }
  const count = vocabularyItems.length

  const onExerciseCheated = async (result: SimpleResult): Promise<void> => {
    await onExerciseFinished(
      results.map(it => ({ ...it, numberOfTries: result === SIMPLE_RESULTS.correct ? 1 : numberOfMaxRetries, result }))
    )
  }

  const isAnswerEqual = (answer1: Answer | AlternativeWord, answer2: Answer | null): boolean =>
    answer2 != null && answer1.article.id === answer2.article.id && answer1.word === answer2.word

  const updateResult = (numberOfTries: number, result: SimpleResult): void => {
    const newResults = [...results]
    newResults[currentWord] = { ...newResults[currentWord], numberOfTries, result }
    setResults(newResults)
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
    setSelectedAnswer(clickedAnswer)

    const isCorrect = correctAnswers.some(it => isAnswerEqual(it, clickedAnswer))
    updateResult(numberOfTries + 1, isCorrect ? SIMPLE_RESULTS.correct : SIMPLE_RESULTS.incorrect)

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
        feedbackType={FeedbackType.vocabularyItem}
        feedbackForId={vocabularyItem.id}
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
