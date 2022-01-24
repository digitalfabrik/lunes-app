import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface ArticleChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({
  navigation,
  route
}: ArticleChoiceExerciseScreenPropsType): ReactElement | null => {
  const response = useLoadDocuments(route.params.discipline, true)

  const documentToAnswers = (document: DocumentType): Answer[] => {
    return ARTICLES.filter(article => article.id !== 0).map(article => ({ article, word: document.word }))
  }

  return (
    <SingleChoiceExercise
      response={response}
      documentToAnswers={documentToAnswers}
      navigation={navigation}
      route={route}
      exerciseKey={ExerciseKeys.articleChoiceExercise}
    />
  )
}

export default ArticleChoiceExerciseScreen
