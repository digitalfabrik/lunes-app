import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { ExerciseKeys } from '../../constants/data'
import { useStorageCache } from '../../hooks/useStorage'
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
  useTrackMountDuration(durationSeconds => {
    if (unitId !== null) {
      trackEvent(storageCache, {
        type: 'module_duration',
        duration_seconds: durationSeconds,
        unit_id: unitId.id,
        exercise_type: ExerciseKeys.wordChoiceExercise,
      })
    }
  })

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
