import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import VocabularyItem from '../../models/VocabularyItem'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

type ArticleChoiceExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenProps): ReactElement | null => {
  const { vocabularyItems, contentType } = route.params
  const unitId = contentType === 'standard' ? route.params.unitId : null

  // Exclude articles 'keiner' and 'die (Plural)'
  const answerOptions = ARTICLES.filter(it => it.id !== 0 && it.id !== 4)

  const singularVocabularyItems = vocabularyItems.filter(it =>
    answerOptions.some(answerOption => JSON.stringify(it.article) === JSON.stringify(answerOption)),
  )

  const vocabularyItemToAnswers = (vocabularyItem: VocabularyItem): Answer[] =>
    answerOptions.map(article => ({ article, word: vocabularyItem.word }))

  return (
    <RouteWrapper>
      <SingleChoiceExercise
        vocabularyItems={singularVocabularyItems}
        unitId={unitId}
        vocabularyItemToAnswer={vocabularyItemToAnswers}
        navigation={navigation}
        route={route}
        exerciseKey={ExerciseKeys.articleChoiceExercise}
      />
    </RouteWrapper>
  )
}

export default ArticleChoiceExerciseScreen
