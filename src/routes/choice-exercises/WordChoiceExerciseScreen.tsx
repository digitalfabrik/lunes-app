import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { Answer, ExerciseKeys } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { shuffleArray } from '../../services/helpers'
import SingleChoiceExercise from './components/SingleChoiceExercise'

type WordChoiceExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
}

const MAX_ANSWERS = 4

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenProps): ReactElement | null => {
  const { vocabularyItems, contentType } = route.params
  const disciplineId = contentType === 'standard' ? route.params.disciplineId : 0
  const answersCount = Math.min(vocabularyItems.length, MAX_ANSWERS)

  const generateFalseAnswers = (correctVocabularyItem: VocabularyItem): Answer[] => {
    const shuffledWrongAnswers = shuffleArray(vocabularyItems.filter(it => it.id !== correctVocabularyItem.id))
    return shuffledWrongAnswers.slice(0, answersCount - 1)
  }

  const vocabularyItemToAnswer = (vocabularyItem: VocabularyItem): Answer[] => {
    const { word, article } = vocabularyItem
    const answers = generateFalseAnswers(vocabularyItem)

    // Insert correct answer on random position
    const positionOfCorrectAnswer = Math.floor(Math.random() * answersCount)
    answers.splice(positionOfCorrectAnswer, 0, { article, word })
    return answers
  }

  return (
    <RouteWrapper>
      <SingleChoiceExercise
        vocabularyItems={vocabularyItems}
        disciplineId={disciplineId}
        vocabularyItemToAnswer={vocabularyItemToAnswer}
        navigation={navigation}
        route={route}
        exerciseKey={ExerciseKeys.wordChoiceExercise}
      />
    </RouteWrapper>
  )
}

export default WordChoiceExerciseScreen
