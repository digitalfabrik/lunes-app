import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface ArticleChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenProps): ReactElement | null => {
  const { documents, discipline } = route.params

  const documentToAnswers = (document: Document): Answer[] =>
    ARTICLES.filter(article => article.id !== 0).map(article => ({ article, word: document.word }))

  return (
    <SingleChoiceExercise
      documents={documents}
      discipline={discipline}
      documentToAnswers={documentToAnswers}
      navigation={navigation}
      route={route}
      exerciseKey={ExerciseKeys.articleChoiceExercise}
    />
  )
}

export default ArticleChoiceExerciseScreen
