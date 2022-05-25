import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import { mockDisciplines } from '../../../../testing/mockDiscipline'
import render from '../../../../testing/render'
import CustomDisciplineDetails from '../CustomDisciplineDetails'

const mockedNavigate = jest.fn()

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate
    })
  }
})

describe('CustomDisciplineDetails', () => {
  it('should navigate on button click', () => {
    const discipline = mockDisciplines(false)[0]
    const { getByText } = render(<CustomDisciplineDetails discipline={discipline} />)
    const button = getByText(labels.home.start)
    fireEvent.press(button)
    expect(mockedNavigate).toHaveBeenCalledWith('DisciplineSelection', {
      discipline
    })
  })
})
