import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { Favorite } from '../../constants/data'
import { StorageCache } from '../../services/Storage'
import { isFavorite } from '../../services/storageUtils'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { renderWithStorageCache } from '../../testing/render'
import FavoriteButton from '../FavoriteButton'

describe('FavoriteButton', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]
  const favorite: Favorite = vocabularyItem.id

  let storageCache: StorageCache

  const renderFavoriteButton = () =>
    renderWithStorageCache(
      storageCache,
      <NavigationContainer>
        <FavoriteButton vocabularyItem={vocabularyItem} />
      </NavigationContainer>,
    )

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should add favorite on click', async () => {
    await storageCache.setItem('favorites', [])
    expect(isFavorite(storageCache.getItem('favorites'), favorite)).toBe(false)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    fireEvent.press(getByTestId('add'))

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    expect(isFavorite(storageCache.getItem('favorites'), favorite)).toBe(true)
  })

  it('should remove favorite on click', async () => {
    await storageCache.setItem('favorites', [favorite])
    expect(isFavorite(storageCache.getItem('favorites'), favorite)).toBe(true)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    fireEvent.press(getByTestId('remove'))

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    expect(isFavorite(storageCache.getItem('favorites'), favorite)).toBe(false)
  })
})
