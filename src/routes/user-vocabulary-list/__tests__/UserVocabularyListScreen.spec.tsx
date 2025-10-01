import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import UserVocabularyListScreen from '../UserVocabularyListScreen'

jest.mock('@react-navigation/native')
jest.mock('react-native-fs', () => ({
  unlink: jest.fn(),
}))

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})

describe('UserVocabularyListScreen', () => {
  const navigation = createNavigationMock<'UserVocabularyList'>()
  const userVocabularyItems = new VocabularyItemBuilder(2).build().map(item => ({ ...item, type: 'user-created' }))

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should render list correctly', async () => {
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    const { getByText, getByPlaceholderText } = renderWithStorageCache(
      storageCache,
      <UserVocabularyListScreen navigation={navigation} />,
    )

    expect(getByText(`2 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByPlaceholderText(getLabels().search.enterWord)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.edit)).toBeDefined()
    expect(getByText(userVocabularyItems[0].word)).toBeDefined()
    expect(getByText(userVocabularyItems[1].word)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.create)).toBeDefined()
  })

  it('should render empty list correctly', async () => {
    const { getByText } = renderWithStorageCache(storageCache, <UserVocabularyListScreen navigation={navigation} />)

    expect(getByText(`0 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.noWordsYet)).toBeDefined()
    expect(getByText(getLabels().userVocabulary.list.create)).toBeDefined()
  })

  it('should delete item', async () => {
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    const { getByText, getAllByTestId } = renderWithStorageCache(
      storageCache,
      <UserVocabularyListScreen navigation={navigation} />,
    )

    expect(getByText(userVocabularyItems[0].word)).toBeDefined()
    const editButton = getByText(getLabels().userVocabulary.list.edit)
    expect(editButton).toBeDefined()

    await act(() => fireEvent.press(editButton))

    const trashIcons = getAllByTestId('trash-icon')
    expect(trashIcons).toHaveLength(2)

    await act(() => fireEvent.press(trashIcons[0]))
    const confirmButton = getByText(getLabels().userVocabulary.list.confirm)
    await act(() => fireEvent.press(confirmButton))

    expect(storageCache.getItem('userVocabulary')).toEqual([userVocabularyItems[0]])
  })
})
