import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExerciseKey, EXERCISES } from '../../../constants/data'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import ExerciseFinishedScreen from '../ExerciseFinishedScreen'

describe('ExerciseFinishedScreen', () => {
  const navigation = createNavigationMock<'ExerciseFinished'>()
  const getRoute = (
    exerciseKey: ExerciseKey,
    correct: boolean,
    unlockedNextExercise: boolean
  ): RouteProp<RoutesParams, 'ExerciseFinished'> => ({
    key: '',
    name: 'ExerciseFinished',
    params: {
      disciplineId: 1,
      disciplineTitle: 'discipline',
      vocabularyItems: new VocabularyItemBuilder(4).build(),
      closeExerciseAction: CommonActions.goBack(),
      exercise: exerciseKey,
      results: new VocabularyItemBuilder(4).build().map(vocabularyItem => ({
        vocabularyItem,
        result: correct ? 'correct' : 'incorrect',
        numberOfTries: 1,
      })),
      unlockedNextExercise,
    },
  })

  it('should render and handle button click for unlocked next exercise', () => {
    const route = getRoute(1, true, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(
      getByText(
        `${getLabels().results.unlockExercise.part1}, ${EXERCISES[2].title} ${getLabels().results.unlockExercise.part2}`
      )
    ).toBeDefined()
    expect(
      getByText(`4 ${getLabels().results.of} 4 ${getLabels().general.words} ${getLabels().results.correct}`)
    ).toBeDefined()
    const button = getByText(getLabels().results.action.nextExercise)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[2].screen, {
      vocabularyItems: route.params.vocabularyItems,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction,
    })
  })

  it('should render and handle button click for good feedback', () => {
    const route = getRoute(1, true, false)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.feedbackGood.replace('\n', ''))).toBeDefined()
    const button = getByText(getLabels().results.action.continue)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[2].screen, {
      vocabularyItems: route.params.vocabularyItems,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction,
    })
  })

  it('should render and handle button click for bad feedback', () => {
    const route = getRoute(1, false, false)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.feedbackBad.replace('\n', ''))).toBeDefined()
    const button = getByText(getLabels().results.action.repeat)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[1].screen, {
      vocabularyItems: route.params.vocabularyItems,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction,
    })
  })

  it('should render and handle button click for completed discipline', () => {
    const route = getRoute(3, true, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedDiscipline)).toBeDefined()
    const button = getByText(getLabels().results.action.disciplineOverview)
    fireEvent.press(button)
    expect(navigation.pop).toHaveBeenCalledWith(2)
  })
})
