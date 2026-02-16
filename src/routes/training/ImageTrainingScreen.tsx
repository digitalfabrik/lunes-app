import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { Image } from 'react-native'
import styled from 'styled-components/native'

import { ChevronRight } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText, ContentTextBold } from '../../components/text/Content'
import { BUTTONS_THEME, MAX_TRAINING_REPETITIONS } from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import { StandardJob } from '../../models/Job'
import VocabularyItem, { VocabularyItemId } from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray } from '../../services/helpers'
import { reportError } from '../../services/sentry'
import ImageGrid, { ImageGridItem, ImageGridItemState } from './components/ImageGrid'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'

type State = {
  vocabularyItems: VocabularyItem[]
  currentVocabularyItemIndex: number
  choices: { src: string; key: VocabularyItemId }[]
  answer: { key: VocabularyItemId; isCorrect: boolean } | null
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
  const insertIndex = Math.floor(Math.random() * (choices.length + 1))
  choices.splice(insertIndex, 0, state.vocabularyItems[state.currentVocabularyItemIndex])
  return { ...state, choices: choices.map(choice => ({ src: choice.images[0], key: choice.id })) }
}

export const initializeState = (vocabularyItems: VocabularyItem[]): State => {
  const shuffled = shuffleArray(vocabularyItems).slice(0, MAX_TRAINING_REPETITIONS)
  const stateWithoutChoices: Omit<State, 'choices'> = {
    vocabularyItems: shuffled,
    currentVocabularyItemIndex: 0,
    answer: null,
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

// eslint-disable-next-line consistent-return
export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'selectAnswer': {
      if (state.answer?.isCorrect) {
        return state
      }
      const isCorrect = action.key === state.vocabularyItems[state.currentVocabularyItemIndex].id
      return {
        ...state,
        correctAnswersCount:
          isCorrect && state.answer === null ? state.correctAnswersCount + 1 : state.correctAnswersCount,
        answer: { key: action.key, isCorrect },
      }
    }
    case 'nextWord': {
      const completed = state.currentVocabularyItemIndex + 1 >= state.vocabularyItems.length
      const nextIndex = completed ? state.currentVocabularyItemIndex : state.currentVocabularyItemIndex + 1
      let nextState: State = { ...state, currentVocabularyItemIndex: nextIndex, completed, answer: null }
      if (!completed) {
        nextState = initializeChoices(nextState)
      }
      return nextState
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
  const word = state.vocabularyItems[state.currentVocabularyItemIndex]
  const imageGridItems: ImageGridItem[] = state.choices.map(({ src, key }) => {
    let imageState = ImageGridItemState.Default
    if (state.answer?.key === key) {
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
    Promise.all(state.vocabularyItems.map(item => Image.prefetch(item.images[0]))).catch(reportError)
  }, [state.vocabularyItems])

  useEffect(() => {
    if (state.completed) {
      navigation.replace('TrainingFinished', {
        trainingType: 'image',
        results: { correct: state.correctAnswersCount, total: state.vocabularyItems.length },
        job,
      })
    }
  }, [state.completed, state.vocabularyItems.length, state.correctAnswersCount, job, navigation])

  if (state.vocabularyItems.length === 0) {
    return null
  }

  const nextWordButton = state.answer?.isCorrect ? (
    <Button
      onPress={() => dispatch({ type: 'nextWord' })}
      label={getLabels().exercises.continue}
      buttonTheme={BUTTONS_THEME.contained}
    />
  ) : (
    <Button
      onPress={() => dispatch({ type: 'nextWord' })}
      label={getLabels().exercises.skip}
      iconRight={ChevronRight}
      buttonTheme={BUTTONS_THEME.text}
      testID='button-skip'
    />
  )

  return (
    <>
      <TrainingExerciseHeader
        currentWord={state.currentVocabularyItemIndex}
        numberOfWords={state.vocabularyItems.length}
        navigation={navigation}
      />

      <TrainingExerciseContainer title={getLabels().exercises.training.image.selectImage} footer={nextWordButton}>
        <QuestionContainer>
          <ContentText>
            {getLabels().exercises.training.image.whatIs} {word.article.value}{' '}
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
