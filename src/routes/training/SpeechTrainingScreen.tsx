import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useReducer } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon, SadSmileyIcon, ThumbsDownIcon, ThumbsUpIcon } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME, MAX_TRAINING_REPETITIONS, SIMPLE_RESULTS } from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray } from '../../services/helpers'
import RecordingButton from './components/RecordingButton'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'
import { evaluateSpeechMatch } from './services/SpeechMatchingService'

const WordImage = styled.Image`
  width: 100%;
  height: 200px;
`

const Centered = styled.View`
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const StatusText = styled(ContentText)`
  text-align: center;
  color: ${props => props.theme.colors.placeholder};
`

const BottomSheetColumn = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const BottomSheetRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const AnswerContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundTransparent};
  padding: ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  width: 100%;
`

type AnswerState = 'correct' | 'similar' | 'incorrect' | 'error' | null

type State = {
  vocabularyItems: VocabularyItem[]
  currentVocabularyItemIndex: number
  hasWrongAnswerForCurrentWord: boolean
  answerState: AnswerState
  correctAnswersCount: number
  completed: boolean
}

type Action =
  | { type: 'speechResult'; answerState: 'correct' | 'similar' | 'incorrect' }
  | { type: 'speechError' }
  | { type: 'retry' }
  | { type: 'nextWord'; isSkipping: boolean }

const initializeState = (vocabularyItems: VocabularyItem[]): State => {
  const selectedItems = shuffleArray(vocabularyItems).slice(0, MAX_TRAINING_REPETITIONS)
  return {
    vocabularyItems: selectedItems,
    currentVocabularyItemIndex: 0,
    hasWrongAnswerForCurrentWord: false,
    answerState: null,
    correctAnswersCount: 0,
    completed: selectedItems.length === 0,
  }
}

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'speechResult': {
      const hasWrongAnswerForCurrentWord =
        state.hasWrongAnswerForCurrentWord || action.answerState !== SIMPLE_RESULTS.correct
      return { ...state, answerState: action.answerState, hasWrongAnswerForCurrentWord }
    }
    case 'speechError':
      return { ...state, answerState: 'error' }
    case 'retry':
      return { ...state, answerState: null }
    case 'nextWord': {
      const completed = state.currentVocabularyItemIndex + 1 >= state.vocabularyItems.length
      const nextIndex = completed ? state.currentVocabularyItemIndex : state.currentVocabularyItemIndex + 1
      const correctAnswersCount =
        !state.hasWrongAnswerForCurrentWord && !action.isSkipping
          ? state.correctAnswersCount + 1
          : state.correctAnswersCount
      return {
        ...state,
        currentVocabularyItemIndex: nextIndex,
        completed,
        correctAnswersCount,
        answerState: null,
        hasWrongAnswerForCurrentWord: false,
      }
    }
    default:
      return state
  }
}

type SpeechTrainingProps = {
  job: StandardJob
  vocabularyItems: VocabularyItem[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SpeechTraining = ({ vocabularyItems, navigation, job }: SpeechTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, vocabularyItems, initializeState)
  const { startRecording, stopRecording, isRecording } = useVoiceRecognition()

  const labels = getLabels().exercises.training.speech
  const currentWord = state.vocabularyItems[state.currentVocabularyItemIndex]

  useEffect(() => {
    if (state.completed) {
      navigation.replace('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: state.correctAnswersCount, total: state.vocabularyItems.length },
        job,
      })
    }
  }, [state.completed, state.vocabularyItems.length, state.correctAnswersCount, job, navigation])

  const handlePressIn = (): void => {
    startRecording({ hints: [currentWord.word, `${currentWord.article.value} ${currentWord.word}`] })
      .then(results => {
        const result = evaluateSpeechMatch(results, currentWord.article.value, currentWord.word)
        dispatch({ type: 'speechResult', answerState: result })
      })
      .catch(() => dispatch({ type: 'speechError' }))
  }

  const handlePressOut = (): void => {
    stopRecording().catch(() => undefined)
  }

  const statusText = isRecording ? labels.listening : labels.prompt

  // incorrect and error allow retry; correct and similar advance to the next word
  const canRetry = state.answerState === 'incorrect' || state.answerState === 'error'

  const renderBottomSheetContent = (): ReactElement => {
    // answerState is always non-null here because BottomSheet is only visible when non-null.
    // The View fallback is never rendered; it exists only to satisfy the type system.
    if (state.answerState === null) {
      // BottomSheet is not visible in this state; this element is never rendered.
      return <BottomSheetColumn />
    }

    if (state.answerState === 'error') {
      return (
        <BottomSheetColumn>
          <SadSmileyIcon />
          <HeadingText>{labels.notUnderstood}</HeadingText>
        </BottomSheetColumn>
      )
    }

    const isCorrect = state.answerState === 'correct'
    const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon

    return (
      <BottomSheetColumn>
        <BottomSheetRow>
          <Icon width={32} height={32} />
          <HeadingText>{isCorrect ? labels.correct : labels.incorrect}</HeadingText>
        </BottomSheetRow>
        {!isCorrect && (
          <AnswerContainer>
            <BottomSheetRow>
              {currentWord.audio !== null && <AudioPlayer audio={currentWord.audio} disabled={false} />}
              <ContentText>
                {currentWord.article.value} {currentWord.word}
              </ContentText>
            </BottomSheetRow>
          </AnswerContainer>
        )}
      </BottomSheetColumn>
    )
  }

  return (
    <>
      <TrainingExerciseHeader
        currentWord={state.currentVocabularyItemIndex}
        numberOfWords={state.vocabularyItems.length}
        navigation={navigation}
      />
      <TrainingExerciseContainer
        title={labels.prompt}
        footer={
          <Button
            onPress={() => dispatch({ type: 'nextWord', isSkipping: true })}
            buttonTheme={BUTTONS_THEME.text}
            label={getLabels().exercises.skip}
            iconRight={ArrowRightIcon}
          />
        }>
        <Centered>
          <WordImage source={{ uri: currentWord.images[0] }} resizeMode='contain' />
          <RecordingButton onPressIn={handlePressIn} onPressOut={handlePressOut} isRecording={isRecording} />
          <StatusText>{statusText}</StatusText>
        </Centered>
      </TrainingExerciseContainer>

      <BottomSheet visible={state.answerState !== null}>
        {renderBottomSheetContent()}
        <BottomSheetColumn>
          {canRetry ? (
            <Button
              onPress={() => dispatch({ type: 'retry' })}
              label={getLabels().exercises.tryAgain}
              buttonTheme={BUTTONS_THEME.contained}
              iconRight={ArrowRightIcon}
            />
          ) : (
            <Button
              onPress={() => dispatch({ type: 'nextWord', isSkipping: false })}
              label={getLabels().exercises.continue}
              buttonTheme={BUTTONS_THEME.contained}
              iconRight={ArrowRightIcon}
            />
          )}
        </BottomSheetColumn>
      </BottomSheet>
    </>
  )
}

type SpeechTrainingScreenProps = {
  route: RouteProp<RoutesParams, 'SpeechTraining'>
  navigation: StackNavigationProp<RoutesParams, 'SpeechTraining'>
}

const SpeechTrainingScreen = ({ route, navigation }: SpeechTrainingScreenProps): ReactElement => {
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

export default SpeechTrainingScreen
