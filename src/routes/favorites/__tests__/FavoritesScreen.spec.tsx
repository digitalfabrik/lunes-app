import React from 'react'

import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import FavoritesScreen from '../FavoritesScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})
jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})

describe('FavoritesScreen', () => {
  const navigation = createNavigationMock<'Favorites'>()
  const userVocabularyItems = new VocabularyItemBuilder(2).buildUserVocabulary()

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should explain how to add favorites when there are none', () => {
    const { getByText } = renderWithStorageCache(storageCache, <FavoritesScreen navigation={navigation} />)

    expect(getByText(`0 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByText(getLabels().favorites.emptyState.title)).toBeDefined()
    expect(getByText(getLabels().favorites.emptyState.subtitle)).toBeDefined()
  })

  it('should render favorites', async () => {
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    await storageCache.setItem(
      'favorites',
      userVocabularyItems.map(item => item.id),
    )
    const { getByText, queryByText, findByText } = renderWithStorageCache(
      storageCache,
      <FavoritesScreen navigation={navigation} />,
    )

    expect(getByText(`2 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(await findByText(userVocabularyItems[0]!.word)).toBeDefined()
    expect(await findByText(userVocabularyItems[1]!.word)).toBeDefined()
    expect(queryByText(getLabels().favorites.emptyState.title)).toBeNull()
  })
})
