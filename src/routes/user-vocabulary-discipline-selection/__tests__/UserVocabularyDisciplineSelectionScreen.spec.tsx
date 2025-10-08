import { StackNavigationProp } from '@react-navigation/stack'
import { fireEvent, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import UserVocabularyDisciplineSelectionScreen from '../UserVocabularyDisciplineSelectionScreen'

jest.mock('@react-navigation/native')

describe('UserVocabularyDisciplineSelectionScreen', () => {
  let navigation: StackNavigationProp<RoutesParams, 'UserVocabularyDisciplineSelection'>
  let storageCache: StorageCache

  beforeEach(async () => {
    storageCache = StorageCache.createDummy()
  })

  const renderScreen = async (mockVocabulary: VocabularyItem[]): Promise<RenderAPI> => {
    await storageCache.setItem('userVocabulary', mockVocabulary)
    navigation = createNavigationMock<'UserVocabularyDisciplineSelection'>()
    return renderWithStorageCache(storageCache, <UserVocabularyDisciplineSelectionScreen navigation={navigation} />)
  }

  it('should render zero disciplines for zero words', async () => {
    const { getByText, queryByText } = await renderScreen([])
    expect(getByText(getLabels().userVocabulary.overview.practice)).toBeDefined()
    expect(getByText(`0 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(queryByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeNull()
  })

  it('should render one discipline for one word', async () => {
    const { getByText } = await renderScreen(new VocabularyItemBuilder(1).build())
    expect(getByText(`1 ${getLabels().general.word.singular}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
  })

  it('should render one discipline for ten words', async () => {
    const { getByText } = await renderScreen(new VocabularyItemBuilder(10).build())
    expect(getByText(`10 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
  })

  it('should render three disciplines for twenty-five words', async () => {
    const { getByText } = await renderScreen(new VocabularyItemBuilder(25).build())
    expect(getByText(`25 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 1`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 2`)).toBeDefined()
    expect(getByText(`${getLabels().userVocabulary.practice.part} 3`)).toBeDefined()
  })

  it('should handle navigation correctly', async () => {
    const vocabularyItems = new VocabularyItemBuilder(25).build().map(item => ({ ...item, type: 'user-created' }))
    const { getByText } = await renderScreen(vocabularyItems)
    const partTwo = getByText(`${getLabels().userVocabulary.practice.part} 2`)
    fireEvent.press(partTwo)
    expect(navigation.navigate).toHaveBeenCalledWith('SpecialExercises', {
      contentType: 'userVocabulary',
      discipline: {
        id: 1,
        title: `${getLabels().userVocabulary.practice.part} ${2}`,
        description: '',
        numberOfChildren: 10,
        isLeaf: true,
        parentTitle: getLabels().userVocabulary.collection,
        needsTrainingSetEndpoint: true,
      },
      disciplineTitle: `${getLabels().userVocabulary.practice.part} 2`,
      vocabularyItems: vocabularyItems.slice(10, 20),
      closeExerciseAction: undefined,
    })
  })
})
