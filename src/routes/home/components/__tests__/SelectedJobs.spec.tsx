import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import SelectedJobs from '../SelectedJobs'

describe('SelectedJobs', () => {
  it('should render correctly with 0 disciplines', () => {
    const navigateToJobSelection = jest.fn()
    const { getByText, getByTestId } = render(
      <SelectedJobs
        navigateToJob={jest.fn()}
        navigateToNextExercise={jest.fn()}
        navigateToJobSelection={navigateToJobSelection}
        navigateToManageSelection={jest.fn()}
      />,
    )
    const heading = getByText(`${getLabels().home.jobs} [0]`)
    expect(heading).toBeDefined()
    expect(getByTestId('edit-professions-button')).toBeDefined()

    const addJobButton = getByTestId('add-profession-button')
    expect(addJobButton).toBeDefined()
    fireEvent.press(addJobButton)
    expect(navigateToJobSelection).toHaveBeenCalled()
  })
})
