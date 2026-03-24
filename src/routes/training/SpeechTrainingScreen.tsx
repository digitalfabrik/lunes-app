import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { Platform } from 'react-native'
import { PERMISSIONS } from 'react-native-permissions'
import {
  SPEECH_TO_TEXT_ERRORS,
  openVoiceInputSettings as openVoiceInputSettingsNative,
} from 'react-native-speech-to-text'
import styled from 'styled-components/native'

import { ArrowRightIcon, SadSmileyIcon } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import CheatMode from '../../components/CheatMode'
import NotAuthorisedView from '../../components/NotAuthorisedView'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import WordResultIndicator from '../../components/WordResultIndicator'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import {
  AnswerState,
  BUTTONS_THEME,
  MAX_TRAINING_REPETITIONS,
  SIMPLE_RESULTS,
  SimpleResult,
} from '../../constants/data'
import useGrantPermissions from '../../hooks/useGrantPermissions'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import useStorage from '../../hooks/useStorage'
import useVoiceRecognition from '../../hooks/useVoiceRecognition'
import { StandardJob } from '../../models/Job'
import VocabularyItem from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray } from '../../services/helpers'
import RecordingButton from './components/RecordingButton'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'
import { evaluateSpeechMatch } from './services/SpeechMatchingService'

const SPEECH_PERMISSIONS =
  Platform.OS === 'ios'
    ? [PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.SPEECH_RECOGNITION]
    : [PERMISSIONS.ANDROID.RECORD_AUDIO]

const WordImage = styled.Image`
  width: 100%;
  height: 200px;
`

const ExerciseContent = styled.View`
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const InstructionText = styled(ContentText)`
  text-align: center;
  color: ${props => props.theme.colors.placeholder};
`

const CheatText = styled(ContentText)`
  text-align: center;
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

const HintsContainer = styled.View`
  align-self: stretch;
  gap: ${props => props.theme.spacings.sm};
`

const HintText = styled(ContentText)`
  color: ${props => props.theme.colors.placeholder};
`

type State = {
  vocabularyItems: VocabularyItem[]
  currentVocabularyItemIndex: number
  hasIncorrectAttempt: boolean
  answerState: AnswerState
  correctAnswersCount: number
  completed: boolean
  isRecognitionUnavailable: boolean
  isLanguageUnavailable: boolean
}

type Action =
  | { type: 'speechResult'; answerState: SimpleResult }
  | { type: 'speechError' }
  | { type: 'recognitionUnavailable' }
  | { type: 'languageUnavailable' }
  | { type: 'retry' }
  | { type: 'nextWord'; isSkipping: boolean }
  | { type: 'cheatAll'; result: SimpleResult }

const initializeState = (vocabularyItems: VocabularyItem[]): State => {
  const selectedItems = shuffleArray(vocabularyItems).slice(0, MAX_TRAINING_REPETITIONS)
  return {
    vocabularyItems: selectedItems,
    currentVocabularyItemIndex: 0,
    hasIncorrectAttempt: false,
    answerState: null,
    correctAnswersCount: 0,
    completed: selectedItems.length === 0,
    isRecognitionUnavailable: false,
    isLanguageUnavailable: false,
  }
}

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'speechResult': {
      const hasIncorrectAttempt = state.hasIncorrectAttempt || action.answerState !== SIMPLE_RESULTS.correct
      return { ...state, answerState: action.answerState, hasIncorrectAttempt }
    }
    case 'speechError':
      return { ...state, answerState: 'error' }
    case 'recognitionUnavailable':
      return { ...state, isRecognitionUnavailable: true }
    case 'languageUnavailable':
      return { ...state, isLanguageUnavailable: true }
    case 'retry':
      return { ...state, answerState: null }
    case 'nextWord': {
      const completed = state.currentVocabularyItemIndex + 1 >= state.vocabularyItems.length
      const nextIndex = completed ? state.currentVocabularyItemIndex : state.currentVocabularyItemIndex + 1
      const correctAnswersCount =
        !state.hasIncorrectAttempt && !action.isSkipping ? state.correctAnswersCount + 1 : state.correctAnswersCount
      return {
        ...state,
        currentVocabularyItemIndex: nextIndex,
        completed,
        correctAnswersCount,
        answerState: null,
        hasIncorrectAttempt: false,
      }
    }
    case 'cheatAll': {
      const correctAnswersCount = action.result === SIMPLE_RESULTS.correct ? state.vocabularyItems.length : 0
      return { ...state, completed: true, correctAnswersCount }
    }
    default:
      return state
  }
}

const notAuthorisedDescription = (state: State, labels: ReturnType<typeof getLabels>): string => {
  if (state.isRecognitionUnavailable) {
    return labels.exercises.training.speech.notAvailable
  }
  if (state.isLanguageUnavailable) {
    return labels.exercises.training.speech.languageUnavailable
  }
  return labels.general.audio.noAuthorization.description
}

type SpeechTrainingProps = {
  job: StandardJob
  vocabularyItems: VocabularyItem[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SpeechTraining = ({ vocabularyItems, navigation, job }: SpeechTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, vocabularyItems, initializeState)
  const { startRecording, stopRecording, isRecording } = useVoiceRecognition()
  const [isDevModeEnabled] = useStorage('isDevModeEnabled')
  const { permissionGranted } = useGrantPermissions(SPEECH_PERMISSIONS)

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

  const handlePressIn = async (): Promise<void> => {
    try {
      const results = await startRecording({
        hints: [currentWord.word, `${currentWord.article.value} ${currentWord.word}`],
      })
      const answerState = evaluateSpeechMatch(results, currentWord.article.value, currentWord.word)
      dispatch({ type: 'speechResult', answerState })
    } catch (error) {
      const errorCode = (error as { code?: string }).code
      if (errorCode === SPEECH_TO_TEXT_ERRORS.recognitionUnavailable) {
        dispatch({ type: 'recognitionUnavailable' })
      } else if (errorCode === SPEECH_TO_TEXT_ERRORS.languageUnavailable) {
        dispatch({ type: 'languageUnavailable' })
      } else {
        dispatch({ type: 'speechError' })
      }
    }
  }

  const handleCheat = (result: SimpleResult): void => {
    dispatch({ type: 'cheatAll', result })
  }

  const handlePressOut = async (): Promise<void> => {
    try {
      await stopRecording()
    } catch {
      // Not much to do, really
    }
  }

  const canRecord = permissionGranted && !state.isRecognitionUnavailable && !state.isLanguageUnavailable
  const openVoiceInputSettings = Platform.OS === 'android' ? openVoiceInputSettingsNative : undefined
  const instructions = isRecording ? labels.releaseToFinish : labels.holdAndSpeak
  const isSimpleResult = state.answerState !== null && state.answerState !== 'error'
  const isCorrect = state.answerState === SIMPLE_RESULTS.correct

  const wordContent = (
    <BottomSheetRow>
      {currentWord.audio !== null && <AudioPlayer audio={currentWord.audio} disabled={false} />}
      <ContentText>
        {currentWord.article.value} {currentWord.word}
      </ContentText>
    </BottomSheetRow>
  )

  const resultButton = isCorrect ? (
    <Button
      onPress={() => dispatch({ type: 'nextWord', isSkipping: false })}
      label={getLabels().exercises.continue}
      buttonTheme={BUTTONS_THEME.contained}
      iconRight={ArrowRightIcon}
    />
  ) : (
    <Button
      onPress={() => dispatch({ type: 'retry' })}
      label={getLabels().exercises.tryAgain}
      buttonTheme={BUTTONS_THEME.contained}
      iconRight={ArrowRightIcon}
    />
  )

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
          <>
            <Button
              onPress={() => dispatch({ type: 'nextWord', isSkipping: true })}
              buttonTheme={BUTTONS_THEME.text}
              label={getLabels().exercises.skip}
              iconRight={ArrowRightIcon}
            />
            <CheatMode cheat={handleCheat} />
          </>
        }
      >
        {canRecord ? (
          <ExerciseContent>
            <WordImage source={{ uri: currentWord.images[0] }} resizeMode='contain' />
            <RecordingButton
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              isRecording={isRecording}
              disabled={isRecording}
            />
            <InstructionText>{instructions}</InstructionText>
            {isDevModeEnabled && (
              <CheatText>
                Cheat: {currentWord.article.value} {currentWord.word}
              </CheatText>
            )}
          </ExerciseContent>
        ) : (
          <NotAuthorisedView
            description={notAuthorisedDescription(state, getLabels())}
            setVisible={() => navigation.goBack()}
            onOpenSettings={state.isLanguageUnavailable ? openVoiceInputSettings : undefined}
          />
        )}
      </TrainingExerciseContainer>

      <WordResultIndicator
        isVisible={isSimpleResult}
        isCorrect={isCorrect}
        label={isCorrect ? labels.correct : labels.incorrect}
        content={wordContent}
        button={resultButton}
      />

      <BottomSheet visible={state.answerState === 'error'}>
        <BottomSheetColumn>
          <SadSmileyIcon />
          <HeadingText>{labels.notUnderstood}</HeadingText>
          <HintsContainer>
            <ContentText>{labels.hints.title}</ContentText>
            <HintText>{labels.hints.holdButton}</HintText>
            <HintText>{labels.hints.speakClearly}</HintText>
            <HintText>{labels.hints.quietEnvironment}</HintText>
          </HintsContainer>
        </BottomSheetColumn>
        <BottomSheetColumn>
          <Button
            onPress={() => dispatch({ type: 'retry' })}
            label={getLabels().exercises.tryAgain}
            buttonTheme={BUTTONS_THEME.contained}
            iconRight={ArrowRightIcon}
          />
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
