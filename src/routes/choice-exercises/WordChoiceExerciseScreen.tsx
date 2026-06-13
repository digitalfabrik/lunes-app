import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useMemo } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { StandardExerciseKeys, StandardExerciseKeyPayload } from '../../constants/data'
import { useStorageCache } from '../../hooks/useStorage'
import useTrackExerciseRepetition from '../../hooks/useTrackExerciseRepetition'
import useTrackMountDuration from '../../hooks/useTrackMountDuration'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { trackEvent } from '../../services/AnalyticsService'
import WordChoiceExercise from './components/WordChoiceExercise'

type WordChoiceExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
}

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenProps): ReactElement | null => {
  const { vocabularyItems, contentType } = route.params
  const unitId = contentType === 'standard' ? route.params.unitId : null
  const isRepetitionExercise = contentType === 'repetition'

  const storageCache = useStorageCache()

  const exerciseKey: StandardExerciseKeyPayload | null = useMemo(
    () =>
      unitId !== null
        ? { type: 'exercise', exercise_type: StandardExerciseKeys.wordChoiceExercise, unit_id: unitId.id }
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

  if (vocabularyItems.length === 0) {
    return null
  }

  return (
    <RouteWrapper shouldSetBottomInset>
      <WordChoiceExercise
        vocabularyItems={vocabularyItems}
        unitId={unitId}
        navigation={navigation}
        route={route}
        isRepetitionExercise={isRepetitionExercise}
      />
    </RouteWrapper>
  )
}

export default WordChoiceExerciseScreen
