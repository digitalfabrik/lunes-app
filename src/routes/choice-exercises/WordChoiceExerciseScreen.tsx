import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { Answer, ExerciseKeys } from '../../constants/data'
import VocabularyItem from '../../models/VocabularyItem'
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
  const unitId = contentType === 'standard' ? route.params.unitId : null
  const answersCount = Math.min(vocabularyItems.length, MAX_ANSWERS)
  const isRepetitionExercise = contentType === 'repetition'

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
        unitId={unitId}
        vocabularyItemToAnswer={vocabularyItemToAnswer}
        navigation={navigation}
        route={route}
        exerciseKey={ExerciseKeys.wordChoiceExercise}
        isRepetitionExercise={isRepetitionExercise}
      />
    </RouteWrapper>
  )
}

export default WordChoiceExerciseScreen
