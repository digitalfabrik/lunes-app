import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useMemo } from 'react'

import ExerciseHeader from '../components/ExerciseHeader'
import RouteWrapper from '../components/RouteWrapper'
import VocabularyList from '../components/VocabularyList'
import { StandardExerciseKeys, StandardExerciseKeyPayload } from '../constants/data'
import { useStorageCache } from '../hooks/useStorage'
import useTrackExerciseRepetition from '../hooks/useTrackExerciseRepetition'
import useTrackMountDuration from '../hooks/useTrackMountDuration'
import { RoutesParams } from '../navigation/NavigationTypes'
import { trackEvent } from '../services/AnalyticsService'
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

  const exerciseKey: StandardExerciseKeyPayload | null = useMemo(
    () =>
      unitId !== null
        ? { type: 'exercise', exercise_type: StandardExerciseKeys.vocabularyList, unit_id: unitId.id }
        : null,
    [unitId],
  )

  useTrackExerciseRepetition(exerciseKey)
  useTrackMountDuration(durationSeconds => {
    if (exerciseKey !== null) {
      trackEvent(storageCache, {
        type: 'module_duration',
        exercise_key: exerciseKey,
        duration_seconds: durationSeconds,
      })
    }
  })
  useEffect(() => {
    if (unitId !== null) {
      setExerciseProgress(storageCache, unitId, StandardExerciseKeys.vocabularyList, 1).catch(reportError)
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
        exerciseKey={StandardExerciseKeys.vocabularyList}
      />
      <VocabularyList
        vocabularyItems={route.params.vocabularyItems}
        onItemPress={onItemPress}
        title={route.params.unitTitle}
      />
    </RouteWrapper>
  )
}

export default VocabularyListScreen
