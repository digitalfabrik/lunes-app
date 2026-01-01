import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import { mockJobs } from '../../../../testing/mockJob'
import render from '../../../../testing/render'
import CustomDisciplineDetails from '../CustomDisciplineDetails'

const navigateToJob = jest.fn()

describe('CustomDisciplineDetails', () => {
  it('should handle button click', () => {
    const job = mockJobs()[0]
    const { getByText } = render(<CustomDisciplineDetails job={job} navigateToJob={navigateToJob} />)
    const button = getByText(getLabels().home.start)
    fireEvent.press(button)
    expect(navigateToJob).toHaveBeenCalledWith(job)
  })
})
