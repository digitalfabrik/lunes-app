import React, { useEffect, useState } from 'react'
import { SingleChoice } from '../components/SingleChoice'
import { SingleChoiceListItemType } from '../components/SingleChoiceListItem'
import { DocumentsType, ENDPOINTS } from '../constants/endpoints'
import axios from '../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Article, ARTICLES, BUTTONS_THEME } from '../constants/data'
import Button from '../components/Button'
import { Text } from 'react-native'
import { WhiteNextArrow } from '../../assets/images'
import { styles } from '../components/Actions'
import styled from 'styled-components/native'

const ButtonContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

interface LearnArticlesExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'VocabularyOverview'>
  navigation: StackNavigationProp<RoutesParamsType, 'VocabularyOverview'>
}

const LearnArticlesExerciseScreen = ({ navigation, route }: LearnArticlesExerciseScreenPropsType) => {
  const { trainingSetId } = route.params.extraParams
  const [documents, setDocuments] = useState<DocumentsType>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [answerOptions, setAnswerOptions] = useState<SingleChoiceListItemType[]>([])
  const [currentWord, setCurrentWord] = useState<number>(0)

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setCount(response.data.length)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const buildAnswerOption = React.useCallback(() => {
    const word: string = documents[currentWord]?.word
    if (!word) {
      return
    }
    const answerOptions: SingleChoiceListItemType[] = []
    for (const article of Object.values(ARTICLES)) {
      answerOptions.push({
        article,
        word,
        correct: false,
        pressed: false,
        selected: false,
        addOpacity: false
      })
    }
    setAnswerOptions(answerOptions)
  }, [currentWord, documents])

  useEffect(() => {
    buildAnswerOption()
  }, [documents, currentWord, buildAnswerOption])

  const onClick = (article: Article) => {
    const answerOptionsUpdated = [...answerOptions]
    answerOptionsUpdated.forEach(answer => {
      if (answer.article === documents[currentWord].article) {
        answer.correct = true
      } else {
        answer.addOpacity = true
      }
      if (answer.article === article) {
        answer.selected = true
      }
    })
    setAnswerOptions(answerOptionsUpdated)
    setIsFinished(true)
  }

  const getNextWord = () => {
    setCurrentWord(prevState => prevState + 1)
    setIsFinished(false)
  }

  return (
    <>
      {!isLoading && <SingleChoice answerOptions={answerOptions} onClick={onClick} />}
      <ButtonContainer>
        {isFinished && (
          <Button onPress={getNextWord} theme={BUTTONS_THEME.dark}>
            <>
              <Text style={[styles.lightLabel, styles.arrowLabel]}>
                {currentWord >= count ? 'ERGEBNISE' : 'NÄCHSTES WORT'}
              </Text>
              <WhiteNextArrow />
            </>
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

export default LearnArticlesExerciseScreen
