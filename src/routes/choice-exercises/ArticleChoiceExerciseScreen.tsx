import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import { Answer, ARTICLES, ExerciseKeys } from '../../constants/data'
import { DocumentType } from '../../constants/endpoints'
import useLoadDocuments from '../../hooks/useLoadDocuments'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface ArticleChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({
  navigation,
  route
}: ArticleChoiceExerciseScreenPropsType): ReactElement | null => {
  const { discipline } = route.params
  const { data: documents, loading } = useLoadDocuments(discipline)

  const documentToAnswers = (document: DocumentType): Answer[] => {
    return ARTICLES.filter(article => article.id !== 0).map(article => ({ article, word: document.word }))
  }

  const onExerciseFinished = (results: DocumentResultType[]): void => {
    navigation.navigate('InitialSummary', {
      result: { discipline: { ...route.params.discipline }, results, exercise: ExerciseKeys.articleChoiceExercise }
    })
  }

  if (documents === null || loading) {
    return null
  }

  return (
    <SingleChoiceExercise
      documents={documents}
      documentToAnswers={documentToAnswers}
      onExerciseFinished={onExerciseFinished}
      navigation={navigation}
      route={route}
    />
  )
}

export default ArticleChoiceExerciseScreen
