import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, ReactElement } from 'react'

import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyList from '../components/VocabularyList'
import { ExerciseKeys } from '../constants/data'
import { useStorageCache } from '../hooks/useStorage'
import { RoutesParams } from '../navigation/NavigationTypes'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import { setExerciseProgress } from '../services/storageUtils'

type VocabularyListScreenProps = {
  route: RouteProp<RoutesParams, 'VocabularyList'>
  navigation: StackNavigationProp<RoutesParams, 'VocabularyList'>
}

const VocabularyListScreen = ({ route, navigation }: VocabularyListScreenProps): ReactElement => {
  const { contentType } = route.params
  const unitId = contentType === 'standard' ? route.params.unitId : null
  const storageCache = useStorageCache()

  useEffect(() => {
    if (unitId !== null) {
      setExerciseProgress(storageCache, unitId, ExerciseKeys.vocabularyList, 1).catch(reportError)
    }
  }, [unitId, storageCache])

  const onItemPress = (index: number) =>
    navigation.navigate('VocabularyDetailExercise', { ...route.params, vocabularyItemIndex: index })

  return (
    <RouteWrapper shouldSetBottomInset>
      <ExerciseHeader
        navigation={navigation}
        confirmClose={false}
        feedbackTarget={unitId !== null ? { type: 'unit', unitId } : undefined}
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
