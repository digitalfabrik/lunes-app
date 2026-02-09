import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ActionDispatch, ReactElement, useEffect, useReducer } from 'react'
import styled, { css } from 'styled-components/native'

import { ArrowRightIcon, ChevronRight, ThumbsDownIcon, ThumbsUpIcon } from '../../../assets/images'
import AudioPlayer from '../../components/AudioPlayer'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { ContentText } from '../../components/text/Content'
import { HeadingText } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import theme from '../../constants/theme'
import useLoadWordsByJob from '../../hooks/useLoadWordsByJob'
import { StandardJob } from '../../models/Job'
import { Route, RoutesParams } from '../../navigation/NavigationTypes'
import { getLabels } from '../../services/helpers'
import TrainingExerciseContainer from './components/TrainingExerciseContainer'
import TrainingExerciseHeader from './components/TrainingExerciseHeader'
import WordsSelector, { SelectedWord, WordsContainer } from './components/WordSelector'
import { Action, initializeState, isSameWord, Sentence, splitSentence, State, stateReducer } from './sentence/State'

const MAX_ATTEMPTS_PER_SENTENCE = 5

const ExerciseInfoContainer = styled.View`
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
  flex-direction: column;
  gap: ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.md} ${props => props.theme.spacings.xs};
`

const SelectedWordsArea = styled.View`
  background-color: ${props => props.theme.colors.backgroundLow};
`

const BottomSheetRow = styled.View`
  padding: ${props => props.theme.spacings.md};
  align-items: center;
`

const BottomSheetColumn = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacings.sm};
`

const BottomSheetWordContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundTransparent};
  padding: ${props => props.theme.spacings.xs};
  border-radius: ${props => props.theme.spacings.xxs};
  width: 100%;
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
  const isCorrect =
    isFinished && state.selectedWordIndexes.every((wordIndex, index) => isSameWord(state, wordIndex, index))

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

type SentenceTrainingProps = {
  job: StandardJob
  sentences: Sentence[]
  navigation: StackNavigationProp<RoutesParams, Route>
}

const SentenceTraining = ({ job, sentences, navigation }: SentenceTrainingProps): ReactElement => {
  const [state, dispatch] = useReducer(stateReducer, sentences, initializeState)
  const currentSentence = state.sentences[state.currentSentenceIndex]
  const isFinished = state.selectedWordIndexes.length === state.randomizedWordIndexes.length
  const selectedWords: SelectedWord[] = state.selectedWordIndexes.map((wordIndex, index) => ({
    index: wordIndex,
    word: currentSentence.words[wordIndex],
    state: isFinished && !isSameWord(state, wordIndex, index) ? 'wrong' : 'enabled',
  }))
  const availableWords: SelectedWord[] = state.randomizedWordIndexes.map(index => ({
    index,
    word: currentSentence.words[index],
    state:
      state.selectedWordIndexes.find(selectedWordIndex => selectedWordIndex === index) === undefined
        ? 'enabled'
        : 'disabled',
  }))
  // Append all unused words to the selected word component and mark them as hidden
  // The purpose is to avoid layout shifts by adding new words
  const selectedAndHiddenWords = selectedWords.concat(
    availableWords.filter(({ state }) => state === 'enabled').map(word => ({ ...word, state: 'hidden' })),
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
            <WordsSelector
              words={selectedAndHiddenWords}
              onPress={index => dispatch({ type: 'unselectWord', index })}
            />
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
  const sentences = vocabularyItems
    ?.filter(item => item.exampleSentence !== undefined)
    .map(({ exampleSentence, id, images }) => ({
      sentence: exampleSentence!.sentence,
      audio: exampleSentence!.audio,
      words: splitSentence(exampleSentence!.sentence),
      id,
      image: images[0],
    }))

  useEffect(() => {
    if (!loading && sentences?.length === 0) {
      navigation.pop()
    }
  }, [loading, sentences, navigation])

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
