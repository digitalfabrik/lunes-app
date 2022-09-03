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

  // Exclude articles 'keiner' and 'die (Plural)'
  const answerOptions = ARTICLES.filter(it => it.id !== 0 && it.id !== 4)

  const singularDocuments = documents.filter(it => answerOptions.includes(it.article))

  const documentToAnswers = (document: Document): Answer[] =>
    answerOptions.map(article => ({ article, word: document.word }))

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
