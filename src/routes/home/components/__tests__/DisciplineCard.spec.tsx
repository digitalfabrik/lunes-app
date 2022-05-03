import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../../constants/labels.json'
import useReadProgress from '../../../../hooks/useReadProgress'
import { getReturnOf } from '../../../../testing/helper'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import DisciplineCard from '../DisciplineCard'

jest.mock('../../../../hooks/useReadProgress')

describe('DisciplineCard', () => {
  const navigate = jest.fn()
  const onPress = jest.fn()

  it('should show progress if enabled', () => {
    mocked(useReadProgress).mockReturnValueOnce(getReturnOf(1))
    const { getByText, getByTestId } = render(
      <DisciplineCard
        discipline={mockDisciplines()[0]}
        showProgress
        navigateToNextExercise={navigate}
        onPress={onPress}
      />
    )
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
    expect(getByText(`1/1`)).toBeDefined()
    expect(getByText(labels.home.progressDescription)).toBeDefined()
    expect(getByText(labels.home.continue)).toBeDefined()
  })

  it('should not show progress if disabled', () => {
    mocked(useReadProgress).mockReturnValueOnce(getReturnOf(0))
    const { getByText, queryByTestId } = render(
      <DisciplineCard
        discipline={mockDisciplines()[0]}
        showProgress={false}
        navigateToNextExercise={navigate}
        onPress={onPress}
      />
    )
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    expect(queryByTestId('progress-circle')).toBeNull()
    expect(getByText(labels.home.start)).toBeDefined()
  })
})
