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
  it('should show progress if enabled', async () => {
    mocked(useReadProgress).mockReturnValueOnce(getReturnOf(1))
    const { findByText, findByTestId } = render(
      <DisciplineCard discipline={mockDisciplines[0]} showProgress navigateToNextExercise={navigate} />
    )
    expect(await findByText(mockDisciplines[0].title)).toBeDefined()
    expect(await findByTestId('progress-circle')).toBeDefined()
    expect(await findByText(`1/1`)).toBeDefined()
    expect(await findByText(labels.home.progressDescription)).toBeDefined()
    expect(await findByText(labels.home.continue)).toBeDefined()
  })

  it('should not show progress if disabled', async () => {
    mocked(useReadProgress).mockReturnValueOnce(getReturnOf(0))
    const { findByText, queryByTestId } = render(
      <DisciplineCard discipline={mockDisciplines[0]} showProgress={false} navigateToNextExercise={navigate} />
    )
    expect(await findByText(mockDisciplines[0].title)).toBeDefined()
    expect(await queryByTestId('progress-circle')).toBeNull()
    expect(await findByText(labels.home.start)).toBeDefined()
  })
})
