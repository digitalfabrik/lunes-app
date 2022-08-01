import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { NextExerciseData } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import useLoadNextExercise from '../../../../hooks/useLoadNextExercise'
import useReadProgress from '../../../../hooks/useReadProgress'
import DocumentBuilder from '../../../../testing/DocumentBuilder'
import { getReturnOf } from '../../../../testing/helper'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import ProfessionDetails from '../ProfessionDetails'

const navigateToDiscipline = jest.fn()
const navigateToExercise = jest.fn()
jest.mock('../../../../services/helpers')
jest.mock('../../../../hooks/useReadProgress')
jest.mock('../../../../hooks/useLoadNextExercise')
jest.mock('@react-navigation/native')

const nextExerciseData: NextExerciseData = {
  documents: new DocumentBuilder(1).build(),
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
      />
    )

  it('should show next exercise details on the card if at least one module is marked done', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(1))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText, findByText, getByTestId } = renderProfessionDetails()
    expect(getByText(nextExerciseData.title)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
    expect(findByText(labels.home.continue)).toBeDefined()
  })

  it('should show starting label instead of continue label if no module is marked done', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(0))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { queryByText, findByText, queryByTestId } = renderProfessionDetails()
    expect(queryByTestId('progress-circle')).toBeDefined()
    expect(findByText(labels.home.start)).toBeDefined()
    expect(queryByText(labels.home.continue)).toBeNull()
  })

  it('should navigate to NextExercise', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(1))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText } = renderProfessionDetails()
    const button = getByText(labels.home.continue)
    fireEvent.press(button)
    expect(navigateToExercise).toHaveBeenCalledWith(nextExerciseData)
  })
})
