import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface WordChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
}

export const MIN_WORDS = 4

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenProps): ReactElement | null => {
  const { documents, discipline } = route.params

  const generateFalseAnswers = (correctDocument: Document): Answer[] => {
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

  const documentToAnswers = (document: Document): Answer[] => {
    const { word, article } = document
    const answers = generateFalseAnswers(document)

    // Insert correct answer on random position
    const positionOfCorrectAnswer = Math.floor(Math.random() * MIN_WORDS)
    answers.splice(positionOfCorrectAnswer, 0, { article, word })
    return answers
  }

  return (
    <SingleChoiceExercise
      documents={documents}
      discipline={discipline}
      documentToAnswers={documentToAnswers}
      navigation={navigation}
      route={route}
      exerciseKey={ExerciseKeys.wordChoiceExercise}
    />
  )
}

export default WordChoiceExerciseScreen
