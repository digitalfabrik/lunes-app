import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import RouteWrapper from '../../components/RouteWrapper'
import { RoutesParams } from '../../navigation/NavigationTypes'
import WordChoiceExercise from './components/WordChoiceExercise.tsx'

type WordChoiceExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
}

const WordChoiceExerciseScreen = ({ navigation, route }: WordChoiceExerciseScreenProps): ReactElement | null => {
  const { vocabularyItems, contentType } = route.params
  const unitId = contentType === 'standard' ? route.params.unitId : null
  const isRepetitionExercise = contentType === 'repetition'

  return (
    <RouteWrapper>
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
