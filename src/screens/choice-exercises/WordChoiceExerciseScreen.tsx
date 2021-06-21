import React, { useEffect, useState } from 'react'
import { DocumentType, ENDPOINTS } from '../../constants/endpoints'
import axios from '../../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, Article } from '../../constants/data'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface WordChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'SingleChoice'>
  navigation: StackNavigationProp<RoutesParamsType, 'SingleChoice'>
}

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenPropsType) => {
  const { extraParams } = route.params
  const { trainingSetId } = extraParams
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const generateFalseAnswers = (correctDocument: DocumentType): Answer[] => {
    const answers = []
    const usedDocuments = [correctDocument]

    // Pick 3 false answer options
    for (let i = 0; i < 3; i++) {
      let rand: number
      // Pick a document as false answer option that was not picked already
      do {
        rand = Math.floor(Math.random() * documents.length)
      } while (usedDocuments.includes(documents[rand]))
      usedDocuments.push(documents[rand])

      const { word, article } = documents[rand]
      answers.push({
        article: article as Article,
        word
      })
    }
    return answers
  }

  const documentToAnswers = (document: DocumentType): Answer[] => {
    const { word, article } = document
    const answers = generateFalseAnswers(document)

    // Insert correct answer on random position
    const positionOfCorrectAnswer = Math.floor(Math.random() * 4)
    answers.splice(positionOfCorrectAnswer, 0, {
      article: article as Article,
      word
    })
    return answers
  }

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const onExerciseFinished = (results: DocumentResultType[]) => {
    const extraParamsWithResults: RoutesParamsType['InitialSummary']['extraParams'] = { ...extraParams, results }
    navigation.navigate('InitialSummary', { extraParams: extraParamsWithResults })
  }

  if (isLoading) {
    return null
  }

  return (
    <SingleChoiceExercise
      documents={documents}
      documentToAnswers={documentToAnswers}
      onExerciseFinished={onExerciseFinished}
    />
  )
}

export default WordChoiceExerciseScreen
