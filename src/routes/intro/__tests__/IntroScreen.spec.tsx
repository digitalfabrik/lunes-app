import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../constants/labels.json'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import IntroScreen from '../IntroScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')

describe('IntroScreen', () => {
  const navigation = createNavigationMock<'Intro'>()

  it('should navigate to profession selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))

    const { getByText } = render(<IntroScreen navigation={navigation} />)
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('ProfessionSelection', { discipline: mockDisciplines[0] })
  })

  it('should skip selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    const { getByText } = render(<IntroScreen navigation={navigation} />)
    const button = getByText(labels.intro.skipSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Home')
    })
  })

  it('should confirm selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines[0]]))
    const { getByText } = render(<IntroScreen navigation={navigation} />)
    const button = getByText(labels.intro.confirmSelection)
    fireEvent.press(button)

    expect(navigation.navigate).toHaveBeenCalledWith('Home')
  })
})
