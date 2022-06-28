import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExerciseKey, EXERCISES } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DocumentBuilder from '../../../testing/DocumentBuilder'
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
      documents: new DocumentBuilder(4).build(),
      closeExerciseAction: CommonActions.goBack(),
      exercise: exerciseKey,
      results: new DocumentBuilder(4).build().map(document => ({
        document,
        result: correct ? 'correct' : 'incorrect',
        numberOfTries: 1
      })),
      unlockedNextExercise
    }
  })

  it('should render and handle button click for unlocked next exercise', () => {
    const route = getRoute(1, true, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(
      getByText(`${labels.results.unlockExercise.part1}, ${EXERCISES[2].title} ${labels.results.unlockExercise.part2}`)
    ).toBeDefined()
    expect(getByText(`4 ${labels.results.of} 4 ${labels.general.words} ${labels.results.correct}`)).toBeDefined()
    const button = getByText(labels.results.action.nextExercise)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[2].screen, {
      documents: route.params.documents,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction
    })
  })

  it('should render and handle button click for good feedback', () => {
    const route = getRoute(1, true, false)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(labels.results.feedbackGood.replace('\n', ''))).toBeDefined()
    const button = getByText(labels.results.action.continue)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[2].screen, {
      documents: route.params.documents,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction
    })
  })

  it('should render and handle button click for bad feedback', () => {
    const route = getRoute(1, false, false)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(labels.results.feedbackBad.replace('\n', ''))).toBeDefined()
    const button = getByText(labels.results.action.repeat)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[1].screen, {
      documents: route.params.documents,
      disciplineId: route.params.disciplineId,
      disciplineTitle: route.params.disciplineTitle,
      closeExerciseAction: route.params.closeExerciseAction
    })
  })

  it('should render and handle button click for completed discipline', () => {
    const route = getRoute(3, true, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(labels.results.finishedModule)).toBeDefined()
    const button = getByText(labels.results.action.close)
    fireEvent.press(button)
    expect(navigation.pop).toHaveBeenCalledWith(2)
  })
})
