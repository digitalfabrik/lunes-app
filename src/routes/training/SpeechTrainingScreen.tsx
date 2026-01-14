import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { Dispatch, ReactElement, useEffect, useReducer } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon, SadSmileyIcon, ThumbsDownIcon, ThumbsUpIcon } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME, MAX_TRAINING_REPETITIONS } from '../../constants/data'
import theme from '../../constants/theme'
import { Color } from '../../constants/theme/colors'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray } from '../../services/helpers'
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
  hasWrongAnswerForCurrentWord: boolean
  answerState: 'correct' | 'incorrect' | 'error' | null
  correctAnswersCount: number
  isFinished: boolean
}

export const initializeState = (vocabularyItems: VocabularyItem[]): State => {
  const shuffled = shuffleArray(vocabularyItems).splice(0, MAX_TRAINING_REPETITIONS)

  return {
    vocabularyItems: shuffled,
    currentIndex: 0,
    hasWrongAnswerForCurrentWord: false,
    answerState: null,
    correctAnswersCount: 0,
    isFinished: shuffled.length === 0,
  }
}

type Action =
  | {
      type: 'speechRecognized'
      results: string[]
    }
  | { type: 'speechError' }
  | { type: 'continue'; isSkipping: boolean }
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
      const hasWrongAnswerForCurrentWord = state.hasWrongAnswerForCurrentWord || !wasCorrect
      return { ...state, answerState, hasWrongAnswerForCurrentWord }
    }
    case 'speechError':
      return { ...state, answerState: 'error' }
    case 'continue': {
      const isFinished = state.currentIndex + 1 >= state.vocabularyItems.length
      const nextIndex = isFinished ? state.currentIndex : state.currentIndex + 1
      const correctAnswersCount =
        state.hasWrongAnswerForCurrentWord || action.isSkipping
          ? state.correctAnswersCount
          : state.correctAnswersCount + 1
      return {
        ...state,
        currentIndex: nextIndex,
        isFinished,
        correctAnswersCount,
        answerState: null,
        hasWrongAnswerForCurrentWord: false,
      }
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

const BottomSheetButtonContainer = styled.View`
  align-items: center;
`

const TextRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  gap: ${props => props.theme.spacings.sm};
`

const BottomSheetInfoContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundTransparent};
  padding: ${props => props.theme.spacings.sm};
  margin-top: ${props => props.theme.spacings.md};
  border-radius: ${props => props.theme.spacings.xxs};
  width: 100%;
`

const BottomSheetErrorText = styled(HeadingText)`
  text-align: center;
`
const ResultIndicator = ({ state, dispatch }: { state: State; dispatch: Dispatch<Action> }): ReactElement => {
  const tryAgain = state.answerState === 'incorrect' || state.answerState === 'error'
  const word = state.vocabularyItems[state.currentIndex]

  let content: ReactElement
  let color: Color
  if (state.answerState === 'error') {
    color = theme.colors.trainingIncorrect
    content = (
      <>
        <BottomSheetRow>
          <SadSmileyIcon />
        </BottomSheetRow>
        <TextRow>
          <BottomSheetErrorText>{getLabels().exercises.training.speech.error}</BottomSheetErrorText>
        </TextRow>
      </>
    )
  } else {
    const isCorrect = state.answerState === 'correct'
    const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon
    color = isCorrect ? theme.colors.trainingCorrect : theme.colors.trainingIncorrect
    content = (
      <>
        <TextRow>
          <Icon width='32' height='32' />
          <HeadingText>
            {isCorrect
              ? getLabels().exercises.training.sentence.correct
              : getLabels().exercises.training.sentence.incorrect}
          </HeadingText>
        </TextRow>
        <BottomSheetInfoContainer>
          <TextRow>
            {word.audio !== null && <AudioPlayer audio={word.audio} disabled={false} />}
            <ContentText>
              {word.article.value} {word.word}
            </ContentText>
          </TextRow>
        </BottomSheetInfoContainer>
      </>
    )
  }

  return (
    <BottomSheet visible={state.answerState !== null} backgroundColor={color}>
      <BottomSheetRow>{content}</BottomSheetRow>
      <BottomSheetButtonContainer>
        {tryAgain ? (
          <Button
            onPress={() => dispatch({ type: 'repeat' })}
            label={getLabels().exercises.tryAgain}
            buttonTheme={BUTTONS_THEME.contained}
            iconRight={ArrowRightIcon}
          />
        ) : (
          <Button
            onPress={() => dispatch({ type: 'continue', isSkipping: false })}
            label={getLabels().exercises.continue}
            buttonTheme={BUTTONS_THEME.contained}
            iconRight={ArrowRightIcon}
          />
        )}
      </BottomSheetButtonContainer>
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

  const recognition = useVoiceRecognition()

  useEffect(() => {
    if (state.isFinished) {
      navigation.replace('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: state.correctAnswersCount, total: state.vocabularyItems.length },
        job,
      })
    }
  }, [job, navigation, state.isFinished, state.vocabularyItems.length, state.correctAnswersCount])

  const statusText = recognition.active
    ? getLabels().exercises.training.speech.speakNow
    : getLabels().exercises.training.speech.pressToSpeak
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
              dispatch({ type: 'continue', isSkipping: true })
            }}
            buttonTheme={BUTTONS_THEME.text}
            label={getLabels().exercises.skip}
            iconRight={ArrowRightIcon}
          />
        }>
        <Centered>
          <ImageContainer>
            <StyledImage src={currentWord.images[0]} />
          </ImageContainer>
          <RecordingButton
            isRecording={recognition.active}
            onPress={() => {
              recognition
                .startRecording({ hints: [currentWord.word] })
                .then(results => dispatch({ type: 'speechRecognized', results }))
                .catch(() => dispatch({ type: 'speechError' }))
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
