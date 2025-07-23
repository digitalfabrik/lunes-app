import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import SelectedProfessions from '../SelectedProfessions'

describe('SelectedProfessions', () => {
  it('should render correctly with 0 disciplines', () => {
    const navigateToProfessionSelection = jest.fn()
    const { getByText, getByTestId } = render(
      <SelectedProfessions
        navigateToDiscipline={jest.fn()}
        navigateToNextExercise={jest.fn()}
        navigateToProfessionSelection={navigateToProfessionSelection}
        navigateToManageSelection={jest.fn()}
      />,
    )
    const heading = getByText(`${getLabels().home.disciplines} [0]`)
    expect(heading).toBeDefined()
    expect(getByTestId('edit-professions-button')).toBeDefined()

    const addProfessionButton = getByTestId('add-profession-button')
    expect(addProfessionButton).toBeDefined()
    fireEvent.press(addProfessionButton)
    expect(navigateToProfessionSelection).toHaveBeenCalled()
  })
})
