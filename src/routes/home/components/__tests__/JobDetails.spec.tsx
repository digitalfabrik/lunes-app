import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { NextExerciseData } from '../../../../constants/data'
import useLoadNextExercise from '../../../../hooks/useLoadNextExercise'
import useReadProgress from '../../../../hooks/useReadProgress'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import { getReturnOf } from '../../../../testing/helper'
import { mockJobs } from '../../../../testing/mockJob'
import mockUnits from '../../../../testing/mockUnit'
import render from '../../../../testing/render'
import JobDetails from '../JobDetails'

const navigateToJob = jest.fn()
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
  jobTitle: 'Exercise Test',
  exerciseKey: 0,
  unit: mockUnits[0],
}

const nextExerciseData: NextExerciseData = {
  vocabularyItems: new VocabularyItemBuilder(1).build(),
  jobTitle: 'Exercise Test',
  exerciseKey: 1,
  unit: mockUnits[1],
}

describe('JobDetails', () => {
  const renderJobDetails = (): RenderAPI =>
    render(<JobDetails job={mockJobs()[0]} navigateToJob={navigateToJob} navigateToNextExercise={navigateToExercise} />)

  it('should show next exercise details on the card', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(1))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText, findByText, getByTestId } = renderJobDetails()
    expect(getByText(nextExerciseData.jobTitle)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.continue)).toBeDefined()
  })

  it('should show starting label if next exercise is a wordlist', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(0))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(firstExerciseData))
    const { queryByText, findByText, queryByTestId } = renderJobDetails()
    expect(queryByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.start)).toBeDefined()
    expect(queryByText(getLabels().home.continue)).toBeNull()
  })

  it('should show continue label if next exercise is not a wordlist', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(1))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { queryByText, findByText, queryByTestId } = renderJobDetails()
    expect(queryByTestId('progress-circle')).toBeDefined()
    expect(findByText(getLabels().home.continue)).toBeDefined()
    expect(queryByText(getLabels().home.start)).toBeNull()
  })

  it('should navigate to NextExercise', () => {
    mocked(useReadProgress).mockReturnValue(getReturnOf(1))
    mocked(useLoadNextExercise).mockReturnValue(getReturnOf(nextExerciseData))
    const { getByText } = renderJobDetails()
    const button = getByText(getLabels().home.continue)
    fireEvent.press(button)
    expect(navigateToExercise).toHaveBeenCalledWith(nextExerciseData)
  })
})
