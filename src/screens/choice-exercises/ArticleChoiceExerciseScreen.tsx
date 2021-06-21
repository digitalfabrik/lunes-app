import React, { useEffect, useState } from 'react'
import { DocumentType, ENDPOINTS } from '../../constants/endpoints'
import axios from '../../utils/axios'
import { RouteProp } from '@react-navigation/native'
import { DocumentResultType, RoutesParamsType } from '../../navigation/NavigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { Answer, ARTICLES } from '../../constants/data'
import SingleChoiceExercise from './components/SingleChoiceExercise'

interface LearnArticlesExerciseScreenPropsType {
  route: RouteProp<RoutesParamsType, 'LearnArticles'>
  navigation: StackNavigationProp<RoutesParamsType, 'LearnArticles'>
}

const ArticleChoiceExerciseScreen = ({ navigation, route }: LearnArticlesExerciseScreenPropsType) => {
  const { extraParams } = route.params
  const { trainingSetId } = extraParams
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const documentToAnswers = (document: DocumentType): Answer[] => {
    return Object.values(ARTICLES).map(article => ({ article, word: document.word }))
  }

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
    axios.get(url).then(response => {
      setDocuments(response.data)
      setIsLoading(false)
    })
  }, [trainingSetId])

  const onExerciseFinished = (results: DocumentResultType[]) => {
    const extraParamsWithResults: RoutesParamsType['InitialSummary']['extraParams'] = { ...extraParams, results }
    navigation.navigate('InitialSummary', { extraParams: extraParamsWithResults })
  }

  if (isLoading) {
    return null
  }

  return (
    <SingleChoiceExercise
      documents={documents}
      documentToAnswers={documentToAnswers}
      onExerciseFinished={onExerciseFinished}
    />
  )
}

export default ArticleChoiceExerciseScreen
