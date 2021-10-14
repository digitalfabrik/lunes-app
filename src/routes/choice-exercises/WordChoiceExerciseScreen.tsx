import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import { useLoadDocumentsRandomOrder } from '../../hooks/useLoadDocuments'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface WordChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise'>
}

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenPropsType): ReactElement | null => {
  const { extraParams } = route.params
  const { trainingSetId } = extraParams
  const { data: documents, loading } = useLoadDocumentsRandomOrder(trainingSetId)

  if (documents === null || loading) {
    return null
  }

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
      answers.push({ article, word })
    }
    return answers
  }

  const documentToAnswers = (document: DocumentType): Answer[] => {
    const { word, article } = document
    const answers = generateFalseAnswers(document)

    // Insert correct answer on random position
    const positionOfCorrectAnswer = Math.floor(Math.random() * 4)
    answers.splice(positionOfCorrectAnswer, 0, { article: article, word })
    return answers
  }

  const onExerciseFinished = (results: DocumentResultType[]): void => {
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results } })
  }

  return (
    <SingleChoiceExercise
      documents={documents}
      documentToAnswers={documentToAnswers}
      onExerciseFinished={onExerciseFinished}
      navigation={navigation}
      route={route}
    />
  )
}

export default WordChoiceExerciseScreen
