import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect } from 'react'

import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyList from '../components/VocabularyList'
import { ExerciseKeys, FeedbackType } from '../constants/data'
import { RoutesParams } from '../navigation/NavigationTypes'
import { setExerciseProgress } from '../services/AsyncStorage'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'

interface VocabularyListScreenProps {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const { disciplineId, closeExerciseAction } = route.params

  useEffect(() => {
    setExerciseProgress(disciplineId, ExerciseKeys.vocabularyList, 1).catch(reportError)
  }, [disciplineId])

  const onItemPress = (index: number) =>
    navigation.navigate('VocabularyDetail', { ...route.params, documentIndex: index })

  return (
    <RouteWrapper>
      <ExerciseHeader
        navigation={navigation}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
        feedbackType={FeedbackType.leaf_discipline}
        feedbackForId={disciplineId}
      />
      <VocabularyList
        documents={route.params.documents}
        onItemPress={onItemPress}
        title={getLabels().exercises.vocabularyList.title}
      />
    </RouteWrapper>
  )
}

export default VocabularyListScreen
