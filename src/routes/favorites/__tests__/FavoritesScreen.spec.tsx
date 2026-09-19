import { act, fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { NetworkError } from '../../../constants/endpoints'
import { VocabularyItemTypes } from '../../../models/VocabularyItem'
import { getWords } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import FavoritesScreen from '../FavoritesScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../services/CmsApi')
jest.mock('../../../components/AudioPlayer', () => () => {
  const { Text } = require('react-native')
  return <Text>AudioPlayer</Text>
})

describe('FavoritesScreen', () => {
  const navigation = createNavigationMock<'Favorites'>()
  const userVocabularyItems = new VocabularyItemBuilder(2).buildUserVocabulary()
  const standardFavorite = { type: VocabularyItemTypes.Standard, id: 1 } as const

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(getWords).mockResolvedValue([])
  })

  it('should explain how to add favorites when there are none', async () => {
    const { getByText, findByText } = renderWithStorageCache(storageCache, <FavoritesScreen navigation={navigation} />)

    expect(await findByText(`0 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(getByText(getLabels().favorites.emptyState.title)).toBeDefined()
    expect(getByText(getLabels().favorites.emptyState.subtitle)).toBeDefined()
  })

  it('should render favorites', async () => {
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    await storageCache.setItem(
      'favorites',
      userVocabularyItems.map(item => item.id),
    )
    const { queryByText, findByText } = renderWithStorageCache(
      storageCache,
      <FavoritesScreen navigation={navigation} />,
    )

    expect(await findByText(`2 ${getLabels().general.word.plural}`)).toBeDefined()
    expect(await findByText(userVocabularyItems[0]!.word)).toBeDefined()
    expect(await findByText(userVocabularyItems[1]!.word)).toBeDefined()
    expect(queryByText(getLabels().favorites.emptyState.title)).toBeNull()
  })

  it('should show a loading indicator while unresolved favorites are loading', async () => {
    await storageCache.setItem('favorites', [standardFavorite])
    const { getByTestId, queryByTestId } = renderWithStorageCache(
      storageCache,
      <FavoritesScreen navigation={navigation} />,
    )

    expect(getByTestId('loading')).toBeDefined()
    await waitFor(() => expect(queryByTestId('loading')).toBeNull())
  })

  it('should show user created favorites even if the vocabulary could not be loaded', async () => {
    mocked(getWords).mockRejectedValue(new Error(NetworkError))
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    await storageCache.setItem(
      'favorites',
      userVocabularyItems.map(item => item.id),
    )
    const { getByText, queryByText } = renderWithStorageCache(storageCache, <FavoritesScreen navigation={navigation} />)

    expect(getByText(userVocabularyItems[0]!.word)).toBeDefined()
    expect(getByText(userVocabularyItems[1]!.word)).toBeDefined()
    expect(queryByText(getLabels().general.error.retryButton)).toBeNull()
  })

  it('should show an error with a retry button when a favorite could not be loaded', async () => {
    mocked(getWords).mockRejectedValue(new Error(NetworkError))
    await storageCache.setItem('favorites', [standardFavorite])
    const { findByText, getByText } = renderWithStorageCache(storageCache, <FavoritesScreen navigation={navigation} />)

    expect(await findByText(`${getLabels().general.error.noWifi} (${NetworkError})`)).toBeDefined()
    expect(getByText(getLabels().general.error.retryButton)).toBeDefined()
  })

  it('should explain that favorites are missing when the request succeeds without them', async () => {
    await storageCache.setItem('favorites', [standardFavorite])
    const { findByText, getByText } = renderWithStorageCache(storageCache, <FavoritesScreen navigation={navigation} />)

    expect(await findByText(getLabels().favorites.loadingError)).toBeDefined()
    expect(getByText(getLabels().general.error.retryButton)).toBeDefined()
  })

  it('should not load the vocabulary again when a favorite is removed', async () => {
    await storageCache.setItem('userVocabulary', userVocabularyItems)
    await storageCache.setItem(
      'favorites',
      userVocabularyItems.map(item => item.id),
    )
    const { getAllByTestId, findByText, queryByText } = renderWithStorageCache(
      storageCache,
      <FavoritesScreen navigation={navigation} />,
    )
    expect(await findByText(userVocabularyItems[0]!.word)).toBeDefined()
    expect(getWords).toHaveBeenCalledTimes(1)

    await act(async () => {
      fireEvent.press(getAllByTestId('remove')[0]!)
    })

    expect(queryByText(userVocabularyItems[0]!.word)).toBeNull()
    expect(queryByText(userVocabularyItems[1]!.word)).toBeDefined()
    expect(getWords).toHaveBeenCalledTimes(1)
  })
})
