import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../../constants/labels.json'
import { useLoadDiscipline } from '../../../../hooks/useLoadDiscipline'
import { getReturnOf } from '../../../../testing/helper'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import DisciplineCard from '../DisciplineCard'

jest.useFakeTimers()
jest.mock('../../../../hooks/useLoadDiscipline')

describe('DisciplineCard', () => {
  const navigate = jest.fn()
  const onPress = jest.fn()

  it('should show discipline card', async () => {
    mocked(useLoadDiscipline).mockReturnValue(getReturnOf(mockDisciplines()[0]))
    const { getByText, findByText, getByTestId } = render(
      <DisciplineCard disciplineId={mockDisciplines()[0].id} navigateToNextExercise={navigate} onPress={onPress} />
    )
    expect(getByText(mockDisciplines()[0].title)).toBeDefined()
    expect(getByTestId('progress-circle')).toBeDefined()
    await expect(findByText(labels.home.continue)).toBeDefined()
  })
})
