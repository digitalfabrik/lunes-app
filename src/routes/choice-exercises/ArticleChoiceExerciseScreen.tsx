import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { Document } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface ArticleChoiceExerciseScreenProps {
  route: RouteProp<RoutesParams, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenProps): ReactElement | null => {
  const { documents, disciplineTitle, disciplineId } = route.params
  const singularDocuments = documents.filter(it => it.article.showAsPossibleAnswer)

  const documentToAnswers = (document: Document): Answer[] =>
    ARTICLES.filter(it => it.showAsPossibleAnswer).map(article => ({ article, word: document.word }))

  return (
    <RouteWrapper>
      <SingleChoiceExercise
        documents={singularDocuments}
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
