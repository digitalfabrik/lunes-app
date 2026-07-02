import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { ChevronRight } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import Button from '../../components/Button'
import CheatMode from '../../components/CheatMode'
import ExerciseHeader from '../../components/ExerciseHeader'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText, ContentTextBold } from '../../components/text/Content'
import {
  BUTTONS_THEME,
  isArticlePlural,
  MAX_TRAINING_REPETITIONS,
  NUMBER_OF_MAX_RETRIES,
  SIMPLE_RESULTS,
  SimpleResult,
  TrainingExerciseKeys,
} from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import { useStorageCache } from '../../hooks/useStorage'
import useTrackDropout from '../../hooks/useTrackDropout'
import useTrackExerciseRepetition from '../../hooks/useTrackExerciseRepetition'
import useTrackForegroundDuration from '../../hooks/useTrackForegroundDuration'
import useTrainingExerciseKey from '../../hooks/useTrainingExerciseKey'
import { StandardJob } from '../../models/Job'
import VocabularyItem, {
  areVocabularyItemIdsEqual,
  VocabularyItemId,
  VocabularyItemTypes,
} from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { trackEvent } from '../../services/AnalyticsService'
import { getAtIndex, getLabels, moveToEnd, shuffleArray } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import ImageGrid, { ImageGridItem, ImageGridItemState } from './components/ImageGrid'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'

type State = {
  vocabularyItems: VocabularyItem[]
  currentVocabularyItemIndex: number
  choices: { src: string; key: VocabularyItemId }[]
  answer: { key: VocabularyItemId; isCorrect: boolean } | null
  incorrectAttemptsForCurrentWord: number
  correctAnswersCount: number
  completed: boolean
}

const initializeChoices = (state: Omit<State, 'choices'>): State => {
  if (state.vocabularyItems.length === 0) {
    return { ...state, choices: [] }
  }

  const vocabularyWithoutCurrentItem = state.vocabularyItems.filter(
    (_, index) => index !== state.currentVocabularyItemIndex,
  )

  const choices = shuffleArray(vocabularyWithoutCurrentItem).slice(0, 3)
  const indexOfCorrectAnswer = Math.floor(Math.random() * (choices.length + 1))
  choices.splice(indexOfCorrectAnswer, 0, getAtIndex(state.vocabularyItems, state.currentVocabularyItemIndex))
  return { ...state, choices: choices.map(choice => ({ src: choice.images[0] ?? '', key: choice.id })) }
}

export const initializeState = (vocabularyItems: VocabularyItem[]): State => {
  const shuffled = shuffleArray(vocabularyItems).slice(0, MAX_TRAINING_REPETITIONS)
  const stateWithoutChoices: Omit<State, 'choices'> = {
    vocabularyItems: shuffled,
    currentVocabularyItemIndex: 0,
    answer: null,
    incorrectAttemptsForCurrentWord: 0,
    correctAnswersCount: 0,
    completed: shuffled.length === 0,
  }
  return initializeChoices(stateWithoutChoices)
}

export type Action =
  | {
      type: 'selectAnswer'
      key: VocabularyItemId
    }
  | { type: 'nextWord' }
  | { type: 'skip' }
  | { type: 'cheatAll'; result: SimpleResult }

// eslint-disable-next-line consistent-return
export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'selectAnswer': {
      const hasReachedMaxAttempts = state.incorrectAttemptsForCurrentWord >= NUMBER_OF_MAX_RETRIES
      if (state.answer?.isCorrect || hasReachedMaxAttempts) {
        return state
      }
      const isCorrect = areVocabularyItemIdsEqual(
        action.key,
        getAtIndex(state.vocabularyItems, state.currentVocabularyItemIndex).id,
      )
      const isFirstAttempt = state.answer === null
      return {
        ...state,
        correctAnswersCount: isCorrect && isFirstAttempt ? state.correctAnswersCount + 1 : state.correctAnswersCount,
        incorrectAttemptsForCurrentWord: isCorrect
          ? state.incorrectAttemptsForCurrentWord
          : state.incorrectAttemptsForCurrentWord + 1,
        answer: { key: action.key, isCorrect },
      }
    }
    case 'nextWord': {
      const completed = state.currentVocabularyItemIndex + 1 >= state.vocabularyItems.length
      const nextIndex = completed ? state.currentVocabularyItemIndex : state.currentVocabularyItemIndex + 1
      let nextState: State = {
        ...state,
        currentVocabularyItemIndex: nextIndex,
        completed,
        answer: null,
        incorrectAttemptsForCurrentWord: 0,
      }
      if (!completed) {
        nextState = initializeChoices(nextState)
      }
      return nextState
    }
    case 'skip': {
      const reorderedVocabularyItems = moveToEnd(state.vocabularyItems, state.currentVocabularyItemIndex)
      const nextState: State = {
        ...state,
        vocabularyItems: reorderedVocabularyItems,
        answer: null,
        incorrectAttemptsForCurrentWord: 0,
      }
      return initializeChoices(nextState)
    }
    case 'cheatAll': {
      return {
        ...state,
        completed: true,
        correctAnswersCount: action.result === SIMPLE_RESULTS.correct ? state.vocabularyItems.length : 0,
      }
    }
  }
}

const QuestionContainer = styled.View`
  flex-flow: row wrap;
  align-items: center;
  padding: 0 ${props => props.theme.spacings.xs};
`

const AudioPlayerContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.sm};
`

type ImageTrainingProps = {
  job: StandardJob
  vocabularyItems: VocabularyItem[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const ImageTraining = ({ vocabularyItems, navigation, job }: ImageTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, vocabularyItems, initializeState)
  const word = getAtIndex(state.vocabularyItems, state.currentVocabularyItemIndex)
  const storageCache = useStorageCache()

  const exerciseKey = useTrainingExerciseKey(TrainingExerciseKeys.image, job.id.id)
  const vocabularyItemId = word.id.type === VocabularyItemTypes.Standard ? word.id.id : undefined

  useTrackExerciseRepetition(exerciseKey)
  useTrackForegroundDuration(durationSeconds => {
    trackEvent(storageCache, {
      type: 'module_duration',
      exercise_key: exerciseKey,
      duration_seconds: durationSeconds,
    })
  })
  const { markCompleted } = useTrackDropout(
    navigation,
    exerciseKey,
    state.currentVocabularyItemIndex,
    state.vocabularyItems.length,
    vocabularyItemId,
  )
  const hasReachedMaxAttempts = state.incorrectAttemptsForCurrentWord >= NUMBER_OF_MAX_RETRIES
  const isResolved = Boolean(state.answer?.isCorrect) || hasReachedMaxAttempts
  const imageGridItems: ImageGridItem[] = state.choices.map(({ src, key }) => {
    const isCorrectChoice = areVocabularyItemIdsEqual(key, word.id)
    let imageState = ImageGridItemState.Default
    if (isResolved && isCorrectChoice) {
      imageState = ImageGridItemState.Correct
    } else if (state.answer && areVocabularyItemIdsEqual(state.answer.key, key)) {
      imageState = state.answer.isCorrect ? ImageGridItemState.Correct : ImageGridItemState.Incorrect
    }
    return {
      src,
      key,
      state: imageState,
    }
  })

  // Prefetch images initially, so users won't have to wait for them to load after each answer
  useEffect(() => {
    Promise.all(
      state.vocabularyItems.filter(item => item.images.length > 0).map(item => Image.prefetch(item.images[0]!)),
    ).catch(reportError)
  }, [state.vocabularyItems])

  useEffect(() => {
    if (state.completed) {
      markCompleted()
      navigation.replace('TrainingFinished', {
        trainingType: 'image',
        results: { correct: state.correctAnswersCount, total: state.vocabularyItems.length },
        job,
      })
    }
  }, [state.completed, state.vocabularyItems.length, state.correctAnswersCount, job, navigation, markCompleted])

  if (state.vocabularyItems.length === 0) {
    return null
  }

  const isLastWord = state.currentVocabularyItemIndex + 1 >= state.vocabularyItems.length

  let footerButton: ReactElement | null = null
  if (isResolved) {
    footerButton = (
      <Button
        onPress={() => dispatch({ type: 'nextWord' })}
        label={getLabels().exercises.continue}
        buttonTheme={BUTTONS_THEME.contained}
      />
    )
  } else if (!isLastWord) {
    // The last word can't be skipped
    footerButton = (
      <Button
        onPress={() => dispatch({ type: 'skip' })}
        label={getLabels().exercises.skip}
        iconRight={ChevronRight}
        buttonTheme={BUTTONS_THEME.text}
        testID='button-skip'
      />
    )
  }

  const questionLabel = isArticlePlural(word.article)
    ? getLabels().exercises.training.image.whatAre
    : getLabels().exercises.training.image.whatIs

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        currentWord={state.currentVocabularyItemIndex}
        numberOfWords={state.vocabularyItems.length}
        feedbackTarget={word.id.type === VocabularyItemTypes.Standard ? { type: 'word', wordId: word.id } : undefined}
      />

      <TrainingExerciseContainer
        title={getLabels().exercises.training.image.selectImage}
        footer={
          <>
            {footerButton}
            <CheatMode cheat={result => dispatch({ type: 'cheatAll', result })} />
          </>
        }
      >
        <QuestionContainer>
          <ContentText>
            {questionLabel} {word.article.value}{' '}
          </ContentText>
          <ContentTextBold>{word.word}</ContentTextBold>
          <ContentText>?</ContentText>
          <AudioPlayerContainer>
            <AudioPlayer disabled={word.audio === null} audio={word.audio ?? ''} />
          </AudioPlayerContainer>
        </QuestionContainer>

        <ImageGrid items={imageGridItems} onPress={item => dispatch({ type: 'selectAnswer', key: item })} />
      </TrainingExerciseContainer>
    </>
  )
}

export type ImageTrainingScreenProps = {
  route: RouteProp<RoutesParams, 'ImageTraining'>
  navigation: StackNavigationProp<RoutesParams, 'ImageTraining'>
}

const ImageTrainingScreen = ({ route, navigation }: ImageTrainingScreenProps): ReactElement => {
  const { job } = route.params
  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByJob(job.id)

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {vocabularyItems && <ImageTraining vocabularyItems={vocabularyItems} navigation={navigation} job={job} />}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default ImageTrainingScreen
