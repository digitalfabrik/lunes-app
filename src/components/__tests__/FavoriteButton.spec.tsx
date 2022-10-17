import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { setFavorites, isFavorite } from '../../services/AsyncStorage'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import render from '../../testing/render'
import FavoriteButton from '../FavoriteButton'

describe('FavoriteButton', () => {
  const vocabularyItem = new VocabularyItemBuilder(1).build()[0]

  const renderFavoriteButton = () =>
    render(
      <NavigationContainer>
        <FavoriteButton vocabularyItem={vocabularyItem} />
      </NavigationContainer>
    )

  it('should add favorite on click', async () => {
    await setFavorites([])
    await expect(isFavorite(vocabularyItem.id)).resolves.toBe(false)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    fireEvent.press(getByTestId('add'))

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    await expect(isFavorite(vocabularyItem.id)).resolves.toBe(true)
  })

  it('should remove favorite on click', async () => {
    await setFavorites([vocabularyItem.id])
    await expect(isFavorite(vocabularyItem.id)).resolves.toBe(true)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    fireEvent.press(getByTestId('remove'))

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    await expect(isFavorite(vocabularyItem.id)).resolves.toBe(false)
  })
})
