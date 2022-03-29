import { fireEvent } from '@testing-library/react-native'
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

  it('should navigate to discipline', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))

    const { findByText } = render(<IntroScreen navigation={navigation} />)
    const firstDiscipline = await findByText('First Discipline')
    const secondDiscipline = await findByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('ProfessionSelection', { discipline: mockDisciplines[0] })
  })

  it('should skip selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    const { findByText } = render(<IntroScreen navigation={navigation} />)
    const button = await findByText(labels.intro.skipSelection)
    fireEvent.press(button)

    expect(navigation.navigate).toHaveBeenCalledWith('Home')
  })

  it('should confirm selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([1]))
    const { findByText } = render(<IntroScreen navigation={navigation} />)
    const button = await findByText(labels.intro.confirmSelection)
    fireEvent.press(button)

    expect(navigation.navigate).toHaveBeenCalledWith('Home')
  })
})
