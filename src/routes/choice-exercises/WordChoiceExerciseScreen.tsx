import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface WordChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise'>
}

export const MIN_WORDS = 4

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenPropsType): ReactElement | null => {
  const response = useLoadDocuments(route.params.discipline, true)

  const generateFalseAnswers = (correctDocument: DocumentType): Answer[] => {
    const { data: documents } = response
    if (!documents) {
      return []
    }
    const answers = []
    const usedDocuments = [correctDocument]

    // Pick 3 false answer options
    for (let i = 0; i < MIN_WORDS - 1; i += 1) {
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
    const positionOfCorrectAnswer = Math.floor(Math.random() * MIN_WORDS)
    answers.splice(positionOfCorrectAnswer, 0, { article, word })
    return answers
  }

  return (
    <SingleChoiceExercise
      response={response}
      documentToAnswers={documentToAnswers}
      navigation={navigation}
      route={route}
      exerciseKey={ExerciseKeys.wordChoiceExercise}
    />
  )
}

export default WordChoiceExerciseScreen
