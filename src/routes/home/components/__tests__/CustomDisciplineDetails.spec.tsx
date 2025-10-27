import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import { mockJobs } from '../../../../testing/mockJob'
import render from '../../../../testing/render'
import CustomDisciplineDetails from '../CustomDisciplineDetails'

const navigateToDiscipline = jest.fn()

describe('CustomDisciplineDetails', () => {
  it('should handle button click', () => {
    const discipline = mockJobs(false)[0]
    const { getByText } = render(
      <CustomDisciplineDetails discipline={discipline} navigateToDiscipline={navigateToDiscipline} />,
    )
    const button = getByText(getLabels().home.start)
    fireEvent.press(button)
    expect(navigateToDiscipline).toHaveBeenCalledWith(discipline)
  })
})
