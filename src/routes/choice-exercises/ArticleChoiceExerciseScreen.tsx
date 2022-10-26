import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface ArticleChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenProps): ReactElement | null => {
  const { vocabularyItems, disciplineTitle, disciplineId } = route.params

  // Exclude articles 'keiner' and 'die (Plural)'
  const answerOptions = ARTICLES.filter(it => it.id !== 0 && it.id !== 4)

  const singularVocabularyItems = vocabularyItems.filter(it => answerOptions.includes(it.article))

  const vocabularyItemToAnswers = (vocabularyItem: VocabularyItem): Answer[] =>
    answerOptions.map(article => ({ article, word: vocabularyItem.word }))

  return (
    <RouteWrapper>
      <SingleChoiceExercise
        vocabularyItems={singularVocabularyItems}
        disciplineId={disciplineId}
        disciplineTitle={disciplineTitle}
        vocabularyItemToAnswer={vocabularyItemToAnswers}
        navigation={navigation}
        route={route}
        exerciseKey={ExerciseKeys.articleChoiceExercise}
      />
    </RouteWrapper>
  )
}

export default ArticleChoiceExerciseScreen
