import React from 'react'
import { DocumentType } from '../../constants/endpoints'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, ARTICLES } from '../../constants/data'
import SingleChoiceExercise from './components/SingleChoiceExercise'
import useLoadDocuments from '../../hooks/useLoadDocuments'

interface LearnArticlesExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'LearnArticles'>
  navigation: StackNavigationProp<RoutesParamsType, 'LearnArticles'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: LearnArticlesExerciseScreenPropsType) => {
  const { extraParams } = route.params
  const { trainingSetId } = extraParams
  const { data: documents } = useLoadDocuments(trainingSetId)

  const documentToAnswers = (document: DocumentType): Answer[] => {
    return Object.values(ARTICLES).map(article => ({ article, word: document.word }))
  }

  const onExerciseFinished = (results: DocumentResultType[]): void => {
    navigation.navigate('InitialSummary', { extraParams: { ...extraParams, results } })
  }

  return (
    documents !== null && (
      <SingleChoiceExercise
        documents={documents}
        documentToAnswers={documentToAnswers}
        onExerciseFinished={onExerciseFinished}
        navigation={navigation}
        route={route}
      />
    )
  )
}

export default ArticleChoiceExerciseScreen
