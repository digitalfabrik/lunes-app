import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { Dispatch, ReactElement, useEffect, useReducer } from 'react'
import styled from 'styled-components/native'

import { ThumbsDownIcon, ThumbsUpIcon } from '../../../assets/images'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import BottomSheet from './components/BottomSheet'
import RecordingButton from './components/RecordingButton'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'

const StyledImage = styled.Image`
  aspect-ratio: 1;
  width: 100%;
`

const ImageContainer = styled.View`
  padding: ${props => props.theme.spacings.xxl};
`

const Centered = styled.View`
  align-items: center;
`

const StatusText = styled(ContentText)`
  padding: ${props => props.theme.spacings.md};
`

export type State = {
  vocabularyItems: VocabularyItem[]
  currentIndex: number
  answerState: 'correct' | 'incorrect' | 'error' | null
  correctAnswersCount: number
}

export const initializeState = (vocabularyItems: VocabularyItem[]): State => ({
  vocabularyItems,
  currentIndex: 0,
  answerState: null,
  correctAnswersCount: 0,
})

type Action =
  | {
      type: 'speechRecognized'
      results: string[]
    }
  | { type: 'speechError' }
  | { type: 'continue' }
  | { type: 'repeat' }

const normalize = (word: string): string => word.toLowerCase().replace(/[.\-_ ]/g, '')

const checkRecognitionResults = (expected: VocabularyItem, results: string[]): boolean => {
  const expectedOptions = [normalize(expected.word), normalize(`${expected.article.value} ${expected.word}`)]
  const normalizedResults = results.map(normalize)
  return normalizedResults.find(result => expectedOptions.find(option => option === result) !== undefined) !== undefined
}

export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'speechRecognized': {
      const wasCorrect = checkRecognitionResults(state.vocabularyItems[state.currentIndex], action.results)
      const answerState = wasCorrect ? 'correct' : 'incorrect'
      return { ...state, answerState }
    }
    case 'speechError':
      return { ...state, answerState: 'error' }
    case 'continue': {
      const nextIndex =
        state.currentIndex + 1 >= state.vocabularyItems.length ? state.currentIndex : state.currentIndex + 1
      const correctAnswersCount =
        state.answerState === 'correct' ? state.correctAnswersCount + 1 : state.correctAnswersCount
      return { ...state, currentIndex: nextIndex, correctAnswersCount, answerState: null }
    }
    case 'repeat': {
      return { ...state, answerState: null }
    }
    default: {
      const _unreachableCheck: never = action
      return state
    }
  }
}

const BottomSheetRow = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-items: center;
`

const BottomSheetColumn = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const ResultIndicator = ({ state, dispatch }: { state: State; dispatch: Dispatch<Action> }): ReactElement => {
  const tryAgain = state.answerState === 'incorrect' || state.answerState === 'error'

  let content: null | ReactElement = null
  if (state.answerState === 'error') {
    // todo
  } else {
    const isCorrect = state.answerState === 'correct'
    const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon

    content = (
      <BottomSheetColumn>
        <Icon width='32' height='32' />
        <HeadingText>
          {isCorrect
            ? getLabels().exercises.training.sentence.correct
            : getLabels().exercises.training.sentence.incorrect}
        </HeadingText>
      </BottomSheetColumn>
    )
  }

  return (
    <BottomSheet visible={state.answerState !== null}>
      <BottomSheetRow>{content}</BottomSheetRow>
      <BottomSheetRow>
        {tryAgain ? (
          <Button
            onPress={() => dispatch({ type: 'repeat' })}
            label='Nochmal versuchen'
            buttonTheme={BUTTONS_THEME.contained}
          />
        ) : (
          <Button onPress={() => dispatch({ type: 'continue' })} label='Weiter' buttonTheme={BUTTONS_THEME.contained} />
        )}
      </BottomSheetRow>
    </BottomSheet>
  )
}

type SpeechTrainingProps = {
  job: StandardJob
  vocabularyItems: VocabularyItem[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SpeechTraining = ({ vocabularyItems, navigation, job }: SpeechTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, vocabularyItems, initializeState)
  const currentWord = state.vocabularyItems[state.currentIndex]

  const recognition = useVoiceRecognition(results => {
    if (results !== null) {
      dispatch({ type: 'speechRecognized', results })
    } else {
      dispatch({ type: 'speechError' })
    }
  })

  useEffect(() => {
    if (state.currentIndex >= state.vocabularyItems.length) {
      navigation.replace('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 0, total: state.vocabularyItems.length },
        job,
      })
    }
  }, [job, navigation, state.currentIndex, state.vocabularyItems.length])

  const statusText = recognition.active ? 'Zum Beenden loslassen' : 'Tippe zum Sprechen auf den Button'
  return (
    <>
      <TrainingExerciseHeader
        currentWord={state.currentIndex}
        numberOfWords={state.vocabularyItems.length}
        navigation={navigation}
      />

      <TrainingExerciseContainer
        title={getLabels().exercises.training.speech.sayWord}
        footer={
          <Button
            onPress={() => {
              dispatch({ type: 'continue' })
            }}
            buttonTheme={BUTTONS_THEME.outlined}
            label={getLabels().exercises.skip}
          />
        }>
        <Centered>
          <ImageContainer>
            <StyledImage src={currentWord.images[0]} />
          </ImageContainer>
          <RecordingButton
            onPressIn={() => {
              recognition.startRecording()
            }}
            onPressOut={() => {
              recognition.stopRecording()
            }}
          />
          <StatusText>{statusText}</StatusText>
        </Centered>
      </TrainingExerciseContainer>

      <ResultIndicator state={state} dispatch={dispatch} />
    </>
  )
}

export type SpeechTrainingScreenProps = {
  route: RouteProp<RoutesParams, 'SpeechTraining'>
  navigation: StackNavigationProp<RoutesParams, 'SpeechTraining'>
}

const ImageTrainingScreen = ({ route, navigation }: SpeechTrainingScreenProps): ReactElement => {
  const { job } = route.params
  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByJob(job.id)

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {vocabularyItems && <SpeechTraining vocabularyItems={vocabularyItems} navigation={navigation} job={job} />}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default ImageTrainingScreen
