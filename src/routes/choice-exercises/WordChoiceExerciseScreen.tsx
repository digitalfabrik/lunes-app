import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { shuffleArray } from '../../services/helpers'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface WordChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
}

const MAX_ANSWERS = 4

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenProps): ReactElement | null => {
  const { documents, discipline } = route.params
  const answersCount = Math.min(documents.length, MAX_ANSWERS)

  const generateFalseAnswers = (correctDocument: Document): Answer[] => {
    const shuffledWrongAnswers = shuffleArray(documents.filter(it => it.id !== correctDocument.id))
    return shuffledWrongAnswers.slice(0, answersCount - 1)
  }

  const documentToAnswers = (document: Document): Answer[] => {
    const { word, article } = document
    const answers = generateFalseAnswers(document)

    // Insert correct answer on random position
    const positionOfCorrectAnswer = Math.floor(Math.random() * answersCount)
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
