import { StackNavigationProp } from '@react-navigation/stack'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { VocabularyItem } from '../../../constants/endpoints'
import useReadUserVocabulary from '../../../hooks/useReadUserVocabulary'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import render from '../../../testing/render'
import UserVocabularyDisciplineSelectionScreen from '../UserVocabularyDisciplineSelectionScreen'

jest.mock('../../../hooks/useReadUserVocabulary')
jest.mock('@react-navigation/native')

describe('UserVocabularyDisciplineSelectionScreen', () => {
  let navigation: StackNavigationProp<RoutesParams, 'UserVocabularyDisciplineSelection'>
  const renderScreen = (mockVocabulary: VocabularyItem[]): RenderAPI => {
    mocked(useReadUserVocabulary).mockReturnValue(getReturnOf(mockVocabulary))
    navigation = createNavigationMock<'UserVocabularyDisciplineSelection'>()
    return render(<UserVocabularyDisciplineSelectionScreen navigation={navigation} />)
  }

  it('should render zero disciplines for zero words', () => {
    const { getByText, queryByText } = renderScreen([])
    expect(getByText(getLabels().userVocabulary.myWords)).toBeDefined()
    expect(getByText(`0 ${getLabels().general.words}`)).toBeDefined()
    expect(queryByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeNull()
  })

  it('should render one discipline for one word', () => {
    const { getByText } = renderScreen(new VocabularyItemBuilder(1).build())
    expect(getByText(`1 ${getLabels().general.word}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
  })

  it('should render one discipline for ten words', () => {
    const { getByText } = renderScreen(new VocabularyItemBuilder(10).build())
    expect(getByText(`10 ${getLabels().general.words}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
  })

  it('should render three disciplines for twenty-five words', () => {
    const { getByText } = renderScreen(new VocabularyItemBuilder(25).build())
    expect(getByText(`25 ${getLabels().general.words}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 2`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 3`)).toBeDefined()
  })

  it('should handle navigation correctly', () => {
    const vocabularyItems = new VocabularyItemBuilder(25).build()
    const { getByText } = renderScreen(vocabularyItems)
    const partTwo = getByText(`${getLabels().userVocabulary.practice.part} 2`)
    fireEvent.press(partTwo)
    expect(navigation.navigate).toHaveBeenCalledWith('UserVocabularyExercises', {
      discipline: {
        id: 1,
        title: `${getLabels().userVocabulary.practice.part} ${2}`,
        description: '',
        numberOfChildren: 10,
        isLeaf: true,
        parentTitle: getLabels().userVocabulary.myWords,
        needsTrainingSetEndpoint: true,
      },
      disciplineId: 0,
      disciplineTitle: `${getLabels().userVocabulary.practice.part} 2`,
      vocabularyItems: vocabularyItems.slice(10, 20),
      closeExerciseAction: undefined,
    })
  })
})
