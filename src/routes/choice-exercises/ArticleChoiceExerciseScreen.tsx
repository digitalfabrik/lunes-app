import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'
import RouteWrapper from '../../components/RouteWrapper'

interface ArticleChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenProps): ReactElement | null => {
  const { documents, disciplineTitle, disciplineId } = route.params

  const documentToAnswers = (document: Document): Answer[] =>
    ARTICLES.filter(article => article.id !== 0).map(article => ({ article, word: document.word }))

  return (
    <RouteWrapper>
      <SingleChoiceExercise
        documents={documents}
        disciplineId={disciplineId}
        disciplineTitle={disciplineTitle}
        documentToAnswers={documentToAnswers}
        navigation={navigation}
        route={route}
        exerciseKey={ExerciseKeys.articleChoiceExercise}
      />
    </RouteWrapper>
  )
}

export default ArticleChoiceExerciseScreen
