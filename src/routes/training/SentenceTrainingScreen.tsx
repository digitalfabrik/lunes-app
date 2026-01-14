import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ActionDispatch, ReactElement, useEffect, useReducer } from 'react'
import styled, { css } from 'styled-components/native'

import { ArrowRightIcon, ChevronRight, ThumbsDownIcon, ThumbsUpIcon } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import Button from '../../components/Button'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME, MAX_TRAINING_REPETITIONS } from '../../constants/data'
import theme from '../../constants/theme'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import { StandardJob } from '../../models/Job'
import { VocabularyItemId } from '../../models/VocabularyItem'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels, shuffleArray, shuffleIndexes } from '../../services/helpers'
import BottomSheet from './components/BottomSheet'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'

const ExerciseInfoContainer = styled.View`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 ${props => props.theme.spacings.xs};
`

const StyledImage = styled.Image`
  aspect-ratio: 1;
  width: ${props => props.theme.sizes.smallImage};
`
const AudioPlayerContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.xs};
`

const ExerciseContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.md} ${props => props.theme.spacings.xs};
`

const SelectedWordsArea = styled.View`
  background-color: ${props => props.theme.colors.backgroundLow};
  min-height: ${props => props.theme.spacings.xxl};
`

type Sentence = {
  id: VocabularyItemId
  image: string
  sentence: string
  words: string[]
  audio: string
}

const MAX_ATTEMPTS_PER_SENTENCE = 5

type State = {
  sentences: Sentence[]
  currentSentenceIndex: number
  randomizedWordIndexes: number[]
  selectedWordIndexes: number[]
  attemptsForCurrentSentence: number
  correctAnswersCount: number
  allSentencesFinished: boolean
}

const splitSentence = (sentence: string): string[] => sentence.split(' ')

const initializeState = (sentences: Sentence[]): State => {
  const shuffled = shuffleArray(sentences).splice(0, MAX_TRAINING_REPETITIONS)
  const currentSentenceIndex = 0
  const sentence = shuffled[currentSentenceIndex]
  return {
    sentences: shuffled,
    currentSentenceIndex,
    randomizedWordIndexes: shuffleIndexes(sentence.words),
    selectedWordIndexes: [],
    attemptsForCurrentSentence: 0,
    correctAnswersCount: 0,
    allSentencesFinished: false,
  }
}

type Action =
  | { type: 'selectWord'; index: number }
  | { type: 'unselectWord'; index: number }
  | { type: 'nextSentence'; wasAnswerCorrect: boolean }
  | { type: 'repeat' }

// eslint-disable-next-line consistent-return
const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'selectWord': {
      if (state.selectedWordIndexes.find(index => index === action.index) !== undefined) {
        return state
      }
      return { ...state, selectedWordIndexes: [...state.selectedWordIndexes, action.index] }
    }
    case 'unselectWord': {
      const withoutIndex = state.selectedWordIndexes.filter(index => index !== action.index)
      return { ...state, selectedWordIndexes: withoutIndex }
    }
    case 'repeat': {
      const currentSentence = state.sentences[state.currentSentenceIndex]
      return {
        ...state,
        selectedWordIndexes: [],
        randomizedWordIndexes: shuffleIndexes(currentSentence.words),
        attemptsForCurrentSentence: state.attemptsForCurrentSentence + 1,
      }
    }
    case 'nextSentence': {
      const hasNextSentence = state.currentSentenceIndex + 1 < state.sentences.length
      const nextIndex = hasNextSentence ? state.currentSentenceIndex + 1 : state.currentSentenceIndex
      const sentence = state.sentences[nextIndex]
      const correctAnswersCount = action.wasAnswerCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount
      return {
        ...state,
        currentSentenceIndex: nextIndex,
        selectedWordIndexes: [],
        randomizedWordIndexes: shuffleIndexes(sentence.words),
        attemptsForCurrentSentence: 0,
        correctAnswersCount,
        allSentencesFinished: !hasNextSentence,
      }
    }
  }
}

const WordsContainer = styled.View`
  display: flex;
  flex-flow: row wrap;
  align-content: space-around;
  padding: ${props => props.theme.spacings.xs};
  gap: ${props => props.theme.spacings.xxs};
`

type WordContainerState = 'enabled' | 'disabled' | 'wrong'
type SelectedWord = { word: string; index: number; state: WordContainerState }

const SingleWordContainer = styled(ContentText)<{ state: WordContainerState }>`
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  ${props =>
    props.state === 'enabled' &&
    css`
      background-color: ${props.theme.colors.buttonBlue};
    `}
  ${props =>
    props.state === 'disabled' &&
    css`
      background-color: ${props.theme.colors.disabled};
      text-decoration-line: line-through;
    `}
  ${props =>
    props.state === 'wrong' &&
    css`
      background-color: ${props.theme.colors.trainingIncorrect};
    `}
`

const WordsSelector = ({
  words,
  onPress,
}: {
  words: SelectedWord[]
  onPress: (index: number) => void
}): ReactElement => (
  <WordsContainer>
    {words.map(({ word, state, index }) => (
      <PressableOpacity key={index} onPress={() => onPress(index)} disabled={state === 'disabled'}>
        <SingleWordContainer state={state}>{word}</SingleWordContainer>
      </PressableOpacity>
    ))}
  </WordsContainer>
)

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

const BottomSheetWordContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundTransparent};
  padding: ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
`

const BottomSheetWord = styled(ContentText)<{ markIncorrect: boolean }>`
  ${props =>
    props.markIncorrect &&
    css`
    border-width: 1px;
    border-radius: ${props.theme.spacings.xxs};
  `}
`

const ResultIndicator = ({
  state,
  dispatch,
  selectedWords,
}: {
  state: State
  dispatch: ActionDispatch<[Action]>
  selectedWords: SelectedWord[]
}): ReactElement => {
  const isFinished = state.selectedWordIndexes.length === state.randomizedWordIndexes.length
  const isCorrect = isFinished && state.selectedWordIndexes.every((wordIndex, index) => wordIndex === index)

  const Icon = isCorrect ? ThumbsUpIcon : ThumbsDownIcon
  const color = isCorrect ? theme.colors.trainingCorrect : theme.colors.trainingIncorrect

  return (
    <BottomSheet visible={isFinished} backgroundColor={color}>
      <BottomSheetRow>
        <BottomSheetColumn>
          <Icon width='32' height='32' />
          <HeadingText>
            {isCorrect
              ? getLabels().exercises.training.sentence.correct
              : getLabels().exercises.training.sentence.incorrect}
          </HeadingText>
        </BottomSheetColumn>

        <BottomSheetRow>
          <BottomSheetWordContainer>
            <WordsContainer>
              {selectedWords.map(({ word, state, index }) => (
                <BottomSheetWord key={index} markIncorrect={state === 'wrong'}>
                  {word}
                </BottomSheetWord>
              ))}
            </WordsContainer>
          </BottomSheetWordContainer>
        </BottomSheetRow>

        {isCorrect || state.attemptsForCurrentSentence >= MAX_ATTEMPTS_PER_SENTENCE ? (
          <Button
            onPress={() => dispatch({ type: 'nextSentence', wasAnswerCorrect: state.attemptsForCurrentSentence === 0 })}
            label={getLabels().exercises.continue}
            iconRight={ArrowRightIcon}
            buttonTheme={BUTTONS_THEME.contained}
          />
        ) : (
          <Button
            onPress={() => dispatch({ type: 'repeat' })}
            label={getLabels().exercises.tryAgain}
            iconRight={ArrowRightIcon}
            buttonTheme={BUTTONS_THEME.contained}
          />
        )}
      </BottomSheetRow>
    </BottomSheet>
  )
}

type ImageTrainingProps = {
  job: StandardJob
  sentences: Sentence[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SentenceTraining = ({ job, sentences, navigation }: ImageTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, sentences, initializeState)
  const currentSentence = state.sentences[state.currentSentenceIndex]
  const isFinished = state.selectedWordIndexes.length === state.randomizedWordIndexes.length
  const selectedWords = state.selectedWordIndexes.map(
    (wordIndex, index) =>
      ({
        index: wordIndex,
        word: currentSentence.words[wordIndex],
        state: isFinished && index !== wordIndex ? 'wrong' : 'enabled',
      }) as const,
  )
  const availableWords = state.randomizedWordIndexes.map(
    index =>
      ({
        index,
        word: currentSentence.words[index],
        state:
          state.selectedWordIndexes.find(selectedWordIndex => selectedWordIndex === index) === undefined
            ? 'enabled'
            : 'disabled',
      }) as const,
  )

  useEffect(() => {
    if (state.allSentencesFinished) {
      navigation.replace('TrainingFinished', {
        trainingType: 'sentence',
        job,
        results: { correct: state.correctAnswersCount, total: state.sentences.length },
      })
    }
  }, [state.allSentencesFinished, job, navigation, state.correctAnswersCount, state.sentences.length])

  return (
    <>
      <TrainingExerciseHeader
        currentWord={state.currentSentenceIndex}
        numberOfWords={state.sentences.length}
        navigation={navigation}
      />

      <TrainingExerciseContainer
        title={getLabels().exercises.training.sentence.orderWords}
        footer={
          <Button
            onPress={() => dispatch({ type: 'nextSentence', wasAnswerCorrect: false })}
            label={getLabels().exercises.skip}
            buttonTheme={BUTTONS_THEME.text}
            iconRight={ChevronRight}
          />
        }>
        <ExerciseInfoContainer>
          <StyledImage src={currentSentence.image} />
          <AudioPlayerContainer>
            <AudioPlayer disabled={false} audio={currentSentence.audio} />
          </AudioPlayerContainer>
          <ContentText>{getLabels().exercises.training.sentence.listen}</ContentText>
        </ExerciseInfoContainer>
        <ExerciseContainer>
          <SelectedWordsArea>
            <WordsSelector words={selectedWords} onPress={index => dispatch({ type: 'unselectWord', index })} />
          </SelectedWordsArea>
          <WordsSelector words={availableWords} onPress={index => dispatch({ type: 'selectWord', index })} />
        </ExerciseContainer>
      </TrainingExerciseContainer>

      <ResultIndicator state={state} dispatch={dispatch} selectedWords={selectedWords} />
    </>
  )
}

export type SentenceTrainingScreenProps = {
  route: RouteProp<RoutesParams, 'SentenceTraining'>
  navigation: StackNavigationProp<RoutesParams, 'SentenceTraining'>
}

const SentenceTrainingScreen = ({ route, navigation }: SentenceTrainingScreenProps): ReactElement => {
  const { job } = route.params
  const { data: vocabularyItems, error, loading, refresh } = useLoadWordsByJob(job.id)
  // TODO: Go back if empty
  const sentences = vocabularyItems
    ?.filter(item => item.exampleSentence !== undefined)
    .map(({ exampleSentence, id, images }) => ({
      sentence: exampleSentence!.sentence,
      audio: exampleSentence!.audio,
      words: splitSentence(exampleSentence!.sentence),
      id,
      image: images[0],
    }))

  return (
    <RouteWrapper>
      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {sentences && sentences.length > 0 && (
          <SentenceTraining job={job} sentences={sentences} navigation={navigation} />
        )}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default SentenceTrainingScreen
