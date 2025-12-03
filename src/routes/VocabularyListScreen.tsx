import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, type JSX } from 'react'

import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyList from '../components/VocabularyList'
import { ExerciseKeys, FeedbackType } from '../constants/data'
import { useStorageCache } from '../hooks/useStorage'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { setExerciseProgress } from '../services/storageUtils'

type VocabularyListScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): JSX.Element => {
  const { contentType, closeExerciseAction } = route.params
  const disciplineId = contentType === 'standard' ? route.params.disciplineId : 0
  const storageCache = useStorageCache()

  useEffect(() => {
    setExerciseProgress(storageCache, disciplineId, ExerciseKeys.vocabularyList, 1).catch(reportError)
  }, [disciplineId, storageCache])

  const onItemPress = (index: number) =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: index })

  return (
    <RouteWrapper shouldSetBottomInset>
      <ExerciseHeader
        navigation={navigation}
        confirmClose={false}
        closeExerciseAction={closeExerciseAction}
        feedbackType={FeedbackType.leaf_discipline}
        feedbackForId={disciplineId}
        exerciseKey={ExerciseKeys.vocabularyList}
      />
      <VocabularyList
        vocabularyItems={route.params.vocabularyItems}
        onItemPress={onItemPress}
        title={getLabels().exercises.vocabularyList.title}
      />
    </RouteWrapper>
  )
}

export default VocabularyListScreen
