import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import AddCustomDiscipline from '../AddCustomDiscipline'

describe('AddCustomDiscipline', () => {
  const navigate = jest.fn()

  it('should render and navigate correctly', async () => {
    const { getByText } = render(<AddCustomDiscipline navigate={navigate} />)
    expect(getByText(labels.home.customDisciplineSection)).toBeDefined()
    expect(getByText(labels.home.customDisciplineExplanation)).toBeDefined()
    const container = getByText(labels.home.addCustomDiscipline)
    expect(container).toBeDefined()
    fireEvent.press(container)
    expect(navigate).toHaveBeenCalled()
  })
})
