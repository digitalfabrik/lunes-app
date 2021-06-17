import React, { useEffect, useMemo, useState } from 'react'
import { SingleChoice } from './components/SingleChoice'
import { SingleChoiceListItemType } from './components/SingleChoiceListItem'
import { DocumentsType, ENDPOINTS } from './../../constants/endpoints'
import axios from './../../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from './../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, Article, BUTTONS_THEME, ExerciseKeys, SIMPLE_RESULTS } from './../../constants/data'
import Button from './../../components/Button'
import { Text } from 'react-native'
import { WhiteNextArrow } from './../../../assets/images'
import { styles } from './../../components/Actions'
import styled from 'styled-components/native'
import WordChoiceExerciseService from './services/WordChoiceExerciseService'
import ArticleChoiceExerciseService from './services/ArticleChoiceExerciseService'

const StyledImage = styled.Image`
  width: 100%;
  height: 35%;
  position: relative;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

interface LearnArticlesExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const ChoiceExerciseScreen = ({ navigation, route }: LearnArticlesExerciseScreenPropsType) => {
  const { extraParams } = route.params
  const { trainingSetId, exercise } = extraParams
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAnswerClicked, setIsAnswerClicked] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [answerOptions, setAnswerOptions] = useState<SingleChoiceListItemType[]>([])
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [results, setResults] = useState<DocumentResultType[]>([])

  const service = useMemo(
    () =>
      exercise === ExerciseKeys.learnArticles ? new ArticleChoiceExerciseService() : new WordChoiceExerciseService(),
    [exercise]
  )

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
      setIsLoading(false)
    })
  }, [trainingSetId])

  useEffect(() => {
    setAnswerOptions(service.buildAnswerOptions(documents, currentWord, count))
  }, [documents, currentWord, service, count])

  const isAnswerEqual = (answer1: Answer, answer2: SingleChoiceListItemType): boolean => {
    return answer1.article === answer2.article && answer1.word === answer2.word
  }

  const onClick = (selectedAnswer: Answer) => {
    const answerOptionsUpdated = [...answerOptions]
    const correctAnswer: Answer = {
      article: documents[currentWord].article as Article,
      word: documents[currentWord].word
    }
    answerOptionsUpdated.forEach(answer => {
      if (isAnswerEqual(correctAnswer, answer)) {
        answer.correct = true
      } else {
        answer.addOpacity = true
      }
      if (isAnswerEqual(selectedAnswer, answer)) {
        answer.selected = true
      }
    })
    if (selectedAnswer.article === correctAnswer.article && selectedAnswer.word === correctAnswer.word) {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.correct }
      setResults([...results, result])
    } else {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.incorrect }
      setResults([...results, result])
    }
    setAnswerOptions(answerOptionsUpdated)
    setIsAnswerClicked(true)
  }

  const buttonClick = () => {
    const exerciseFinished = currentWord + 1 >= count
    const extraParamsWithResults: RoutesParamsType['InitialSummary']['extraParams'] = { ...extraParams, results }
    if (exerciseFinished) {
      setCurrentWord(0)
      setResults([])
      navigation.navigate('InitialSummary', { extraParams: extraParamsWithResults })
    } else {
      setCurrentWord(prevState => prevState + 1)
      setIsAnswerClicked(false)
    }
  }

  return (
    <>
      <StyledImage
        source={{
          uri: documents[currentWord]?.document_image[0].image
        }}
      />
      {!isLoading && <SingleChoice answerOptions={answerOptions} onClick={onClick} isAnswerClicked={isAnswerClicked} />}
      <ButtonContainer>
        {isAnswerClicked && (
          <Button onPress={buttonClick} theme={BUTTONS_THEME.dark}>
            <>
              <Text style={[styles.lightLabel, styles.arrowLabel]}>
                {currentWord + 1 >= count ? 'ERGEBNISE' : 'NÄCHSTES WORT'}
              </Text>
              <WhiteNextArrow />
            </>
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

export default ChoiceExerciseScreen
