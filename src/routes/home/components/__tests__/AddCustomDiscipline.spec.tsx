import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import AddCustomDiscipline from '../AddCustomDiscipline'

describe('AddCustomDiscipline', () => {
  const navigate = jest.fn()

  it('should render and navigate correctly', async () => {
    const { getByText } = render(<AddCustomDiscipline navigate={navigate} />)
    expect(getByText(getLabels().home.customDisciplineSection)).toBeDefined()
    expect(getByText(getLabels().home.customDisciplineExplanation)).toBeDefined()
    const container = getByText(getLabels().home.addCustomDiscipline)
    expect(container).toBeDefined()
    fireEvent.press(container)
    expect(navigate).toHaveBeenCalled()
  })
})
