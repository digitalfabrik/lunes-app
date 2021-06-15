import React, { useEffect, useState } from 'react'
import { SingleChoice } from '../components/SingleChoice'
import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'
import { DocumentsType, ENDPOINTS } from '../constants/endpoints'
import axios from '../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, BUTTONS_THEME, isArticle, SIMPLE_RESULTS } from '../constants/data'
import Button from '../components/Button'
import { Text } from 'react-native'
import { WhiteNextArrow } from '../../assets/images'
import { styles } from '../components/Actions'
import styled from 'styled-components/native'

const ButtonContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

const StyledImage = styled.Image`
  width: 100%;
  height: 35%;
  position: relative;
`

interface SingleChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const SingleChoiceExerciseScreen = ({ navigation, route }: SingleChoiceExerciseScreenPropsType) => {
  const { trainingSetId } = route.params.extraParams
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAnswerClicked, setIsAnswerClicked] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [answerOptions, setAnswerOptions] = useState<SingleChoiceListItemType[]>([])
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [results, setResults] = useState<DocumentResultType[]>([])

  const { extraParams } = route.params

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const generateFalseAnswers = React.useCallback(
    (answerOptions: SingleChoiceListItemType[]) => {
      const usedWords = [currentWord]
      for (let i = 0; i < 3; i++) {
        let rand: number
        do {
          rand = Math.floor(Math.random() * count)
        } while (usedWords.includes(rand))
        usedWords.push(rand)

        const { word, article } = documents[rand]
        if (!isArticle(article)) {
          return
        }

        answerOptions.push({
          article,
          word,
          correct: false,
          pressed: false,
          selected: false,
          addOpacity: false
        })
      }
    },
    [count, currentWord, documents]
  )

  const buildAnswerOption = React.useCallback(() => {
    const { word, article } = documents[currentWord] || {}
    if (!word || !isArticle(article) || count === 0) {
      return
    }
    const answerOptions: SingleChoiceListItemType[] = []
    generateFalseAnswers(answerOptions)

    const positionOfCorrectAnswer = Math.floor(Math.random() * 4)
    answerOptions.splice(positionOfCorrectAnswer, 0, {
      article,
      word,
      correct: false,
      pressed: false,
      selected: false,
      addOpacity: false
    })
    setAnswerOptions(answerOptions)
  }, [currentWord, documents, count, generateFalseAnswers])

  useEffect(() => {
    buildAnswerOption()
  }, [documents, currentWord, buildAnswerOption])

  const onClick = (answer: Answer) => {
    const answerOptionsUpdated = [...answerOptions]
    const word = answer.word
    answerOptionsUpdated.forEach(answer => {
      if (answer.word === documents[currentWord].word) {
        answer.correct = true
      } else {
        answer.addOpacity = true
      }
      if (answer.word === word) {
        answer.selected = true
      }
    })
    if (word === documents[currentWord].word) {
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
    const exersiceFinished = currentWord + 1 >= count
    const extraParamsWithResults: any = extraParams
    extraParamsWithResults.results = results
    if (exersiceFinished) {
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
      {!isLoading && <SingleChoice answerOptions={answerOptions} onClick={onClick} isAnswerClicked={isAnswerClicked}/>}

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

export default SingleChoiceExerciseScreen
