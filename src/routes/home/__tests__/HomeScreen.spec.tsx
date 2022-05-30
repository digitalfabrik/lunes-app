import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { ARTICLES } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import useReadNextExercise from '../../../hooks/useReadNextExercise'
import useReadProgress from '../../../hooks/useReadProgress'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockCustomDiscipline } from '../../../testing/mockCustomDiscipline'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('../../../services/helpers')
jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
jest.mock('../../../hooks/useReadProgress')
jest.mock('../../../hooks/useReadNextExercise')
jest.mock('../../../hooks/useReadSelectedProfessions')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useLoadDiscipline')
jest.mock('../../../components/HeaderWithMenu', () => {
  const Text = require('react-native').Text
  return () => <Text>HeaderWithMenu</Text>
})

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()
  const nextExercise = {
    disciplineId: 1,
    exerciseKey: 2
  }

  const documents = [
    {
      id: 1,
      word: 'Spachtel',
      article: ARTICLES[1],
      document_image: [{ id: 1, image: 'Spachtel' }],
      audio: 'https://example.com/my-audio',
      alternatives: [
        {
          word: 'Spachtel',
          article: ARTICLES[2]
        },
        {
          word: 'Alternative',
          article: ARTICLES[2]
        }
      ]
    },
    {
      id: 2,
      word: 'Auto',
      article: ARTICLES[1],
      document_image: [{ id: 1, image: 'Auto' }],
      audio: '',
      alternatives: []
    }
  ]

  it('should render professions', () => {
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf(mockDisciplines().map(item => item.id)))
    mocked(useLoadDiscipline)
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[0]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[1]))
    mocked(useReadNextExercise).mockReturnValue(getReturnOf(nextExercise))
    mocked(useReadProgress).mockReturnValue(getReturnOf(0))
    const { getByText } = render(<HomeScreen navigation={navigation} />)
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
  })

  it('should navigate to child discipline', () => {
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf(mockDisciplines().map(item => item.id)))
    mocked(useLoadDiscipline)
      .mockReturnValue(getReturnOf(mockDisciplines()[0]))
      .mockReturnValue(getReturnOf(mockDisciplines()[1]))
    mocked(useReadNextExercise).mockReturnValue(getReturnOf(nextExercise))
    mocked(useReadProgress).mockReturnValue(getReturnOf(0))
    React.useState = jest
      .fn()
      .mockReturnValue([documents, {}])
      .mockReturnValue([mockDisciplines()[0], {}])
      .mockReturnValue([false, {}])
    const { debug } = render(<HomeScreen navigation={navigation} />)
    debug()
  })

  // TODO LUN-328 add test for navigate to child disciplines

  it('should show custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf(['abc']))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf([]))
    mocked(useLoadDiscipline).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { getByText } = render(<HomeScreen navigation={navigation} />)
    expect(getByText('Custom Discipline')).toBeDefined()
    expect(getByText(labels.home.start)).toBeDefined()
  })

  it('should show suggestion to add custom discipline', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf([]))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf([]))

    const { getByText } = render(<HomeScreen navigation={navigation} />)
    const addCustomDiscipline = getByText(labels.home.addCustomDiscipline)
    expect(addCustomDiscipline).toBeDefined()

    fireEvent.press(addCustomDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('AddCustomDiscipline')
  })
})
