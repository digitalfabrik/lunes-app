import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { NextExerciseData } from '../../../../constants/data'
import useLoadNextExercise from '../../../../hooks/useLoadNextExercise'
import useReadProgress from '../../../../hooks/useReadProgress'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import { getReturnOf } from '../../../../testing/helper'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import ProfessionDetails from '../ProfessionDetails'

const navigateToDiscipline = jest.fn()
const navigateToExercise = jest.fn()
jest.mock('../../../../services/helpers', () => ({
  ...jest.requireActual('../../../../services/helpers'),
  childrenLabel: jest.fn(() => []),
}))
jest.mock('../../../../hooks/useReadProgress')
jest.mock('../../../../hooks/useLoadNextExercise')
jest.mock('@react-navigation/native')

const firstExerciseData: NextExerciseData = {
  vocabularyItems: new VocabularyItemBuilder(1).build(),
  title: 'Exercise Test',
  exerciseKey: 0,
  disciplineId: 1,
}

const nextExerciseData: NextExerciseData = {
  vocabularyItems: new VocabularyItemBuilder(1).build(),
  title: 'Exercise Test',
  exerciseKey: 1,
  disciplineId: 1,
}

describe('ProfessionDetails', () => {
  const renderProfessionDetails = (): RenderAPI =>
    render(
      <ProfessionDetails
        discipline={mockDisciplines()[0]}
        navigateToDiscipline={navigateToDiscipline}
        navigateToNextExercise={navigateToExercise}
      />,
    )

  it('should show next exercise details on the card', () => {
    mocked(useReadProgress).mockReturnValue(1)
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText, findByText, getByTestId } = renderProfessionDetails()
    expect(getByText(nextExerciseData.title)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.continue)).toBeDefined()
  })

  it('should show starting label if next exercise is a wordlist', () => {
    mocked(useReadProgress).mockReturnValue(0)
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(firstExerciseData))
    const { queryByText, findByText, queryByTestId } = renderProfessionDetails()
    expect(queryByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.start)).toBeDefined()
    expect(queryByText(getLabels().home.continue)).toBeNull()
  })

  it('should show continue label if next exercise is not a wordlist', () => {
    mocked(useReadProgress).mockReturnValue(1)
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { queryByText, findByText, queryByTestId } = renderProfessionDetails()
    expect(queryByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.continue)).toBeDefined()
    expect(queryByText(getLabels().home.start)).toBeNull()
  })

  it('should navigate to NextExercise', () => {
    mocked(useReadProgress).mockReturnValue(1)
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText } = renderProfessionDetails()
    const button = getByText(getLabels().home.continue)
    fireEvent.press(button)
    expect(navigateToExercise).toHaveBeenCalledWith(nextExerciseData)
  })
})
