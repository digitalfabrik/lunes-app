import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useReducer } from 'react'
import styled, { css } from 'styled-components/native'

import { ChevronRight } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import Button from '../../components/Button'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME, MAX_TRAINING_REPETITIONS } from '../../constants/data'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
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

const BottomSheetRow = styled.View`
  padding: ${props => props.theme.spacings.md};
`

type Sentence = {
  id: VocabularyItemId
  image: string
  sentence: string
  words: string[]
  audio: string
}

type State = {
  sentences: Sentence[]
  currentSentenceIndex: number
  randomizedWordIndexes: number[]
  selectedWordIndexes: number[]
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
    allSentencesFinished: false,
  }
}

type Action =
  | { type: 'selectWord'; index: number }
  | { type: 'unselectWord'; index: number }
  | { type: 'nextSentence' }
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
      return { ...state, selectedWordIndexes: [], randomizedWordIndexes: shuffleIndexes(currentSentence.words) }
    }
    case 'nextSentence': {
      const hasNextSentence = state.currentSentenceIndex + 1 < state.sentences.length
      const nextIndex = hasNextSentence ? state.currentSentenceIndex + 1 : state.currentSentenceIndex
      const sentence = state.sentences[nextIndex]
      return {
        ...state,
        currentSentenceIndex: nextIndex,
        selectedWordIndexes: [],
        randomizedWordIndexes: shuffleIndexes(sentence.words),
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
  gap: ${props => props.theme.spacings.xs};
`

const SingleWordContainer = styled(ContentText)<{ enabled: boolean }>`
  padding: ${props => props.theme.spacings.xxs} ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  ${props =>
    props.enabled
      ? css`
          background-color: ${props.theme.colors.buttonBlue};
        `
      : css`
          background-color: ${props.theme.colors.disabled};
          text-decoration-line: line-through;
        `}
`

const WordsSelector = ({
  words,
  onPress,
}: {
  words: { word: string; index: number; enabled: boolean }[]
  onPress: (index: number) => void
}): ReactElement => (
  <WordsContainer>
    {words.map(({ word, enabled, index }) => (
      <PressableOpacity key={index} onPress={() => onPress(index)} disabled={!enabled}>
        <SingleWordContainer enabled={enabled}>{word}</SingleWordContainer>
      </PressableOpacity>
    ))}
  </WordsContainer>
)

type ImageTrainingProps = {
  sentences: Sentence[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SentenceTraining = ({ sentences, navigation }: ImageTrainingProps): ReactElement | null => {
  const [state, dispatch] = useReducer(stateReducer, sentences, initializeState)
  const currentSentence = state.sentences[state.currentSentenceIndex]
  const selectedWords = state.selectedWordIndexes.map(index => ({
    index,
    word: currentSentence.words[index],
    enabled: true,
  }))
  const availableWords = state.randomizedWordIndexes.map(index => ({
    index,
    word: currentSentence.words[index],
    enabled: state.selectedWordIndexes.find(selectedWordIndex => selectedWordIndex === index) === undefined,
  }))
  const isFinished = state.selectedWordIndexes.length === state.randomizedWordIndexes.length
  const isCorrect = state.selectedWordIndexes.every((wordIndex, index) => wordIndex === index)

  useEffect(() => {
    if (state.allSentencesFinished) {
      navigation.goBack()
    }
  }, [state.allSentencesFinished, navigation])

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
            onPress={() => dispatch({ type: 'nextSentence' })}
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

      <BottomSheet visible={isFinished}>
        <BottomSheetRow>
          <HeadingText>
            {isCorrect
              ? getLabels().exercises.training.sentence.correct
              : getLabels().exercises.training.sentence.incorrect}
          </HeadingText>

          <BottomSheetRow>
            <ExerciseInfoContainer>
              <AudioPlayerContainer>
                <AudioPlayer disabled={false} audio={currentSentence.audio} />
              </AudioPlayerContainer>
              <ContentText>{currentSentence.sentence}</ContentText>
            </ExerciseInfoContainer>
          </BottomSheetRow>

          {isCorrect ? (
            <Button
              onPress={() => dispatch({ type: 'nextSentence' })}
              label={getLabels().exercises.continue}
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            <Button
              onPress={() => dispatch({ type: 'repeat' })}
              label={getLabels().exercises.tryAgain}
              iconRight={ChevronRight}
              buttonTheme={BUTTONS_THEME.contained}
            />
          )}
        </BottomSheetRow>
      </BottomSheet>
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
        {sentences && sentences.length > 0 && <SentenceTraining sentences={sentences} navigation={navigation} />}
      </ServerResponseHandler>
    </RouteWrapper>
  )
}

export default SentenceTrainingScreen
