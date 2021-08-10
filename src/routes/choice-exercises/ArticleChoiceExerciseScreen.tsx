import React, { ReactElement } from 'react'
import { DocumentType } from '../../constants/endpoints'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, ARTICLES } from '../../constants/data'
import SingleChoiceExercise from './components/SingleChoiceExercise'
import useLoadDocuments from '../../hooks/useLoadDocuments'

interface ArticleChoiceExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'ArticleChoiceExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'ArticleChoiceExercise'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: ArticleChoiceExerciseScreenPropsType): ReactElement | null => {
  const { extraParams } = route.params
  const { trainingSetId } = extraParams
  const { data: documents, loading } = useLoadDocuments(trainingSetId)

  const documentToAnswers = (document: DocumentType): Answer[] => {
    return ARTICLES.filter(article => article.id !== 0).map(article => ({ article, word: document.word }))
  }

  const onExerciseFinished = (results: DocumentResultType[]): void => {
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results } })
  }

  if (documents === null || loading) {
    return null
  }

  return <SingleChoiceExercise
        documents={documents}
        documentToAnswers={documentToAnswers}
        onExerciseFinished={onExerciseFinished}
        navigation={navigation}
        route={route}
      />
}

export default ArticleChoiceExerciseScreen
