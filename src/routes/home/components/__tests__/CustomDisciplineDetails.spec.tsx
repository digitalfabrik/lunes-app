import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import CustomDisciplineDetails from '../CustomDisciplineDetails'

const navigateToDiscipline = jest.fn()

describe('CustomDisciplineDetails', () => {
  it('should handle button click', () => {
    const discipline = mockDisciplines(false)[0]
    const { getByText } = render(
      <CustomDisciplineDetails discipline={discipline} navigateToDiscipline={navigateToDiscipline} />
    )
    const button = getByText(labels.home.start)
    fireEvent.press(button)
    expect(navigateToDiscipline).toHaveBeenCalledWith(discipline)
  })
})
