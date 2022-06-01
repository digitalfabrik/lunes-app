import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import AsyncStorage from '../../services/AsyncStorage'
import DocumentBuilder from '../../testing/DocumentBuilder'
import render from '../../testing/render'
import FavoriteButton from '../FavoriteButton'

describe('FavoriteButton', () => {
  const document = new DocumentBuilder(1).build()[0]

  const renderFavoriteButton = () =>
    render(
      <NavigationContainer>
        <FavoriteButton document={document} />
      </NavigationContainer>
    )

  it('should add favorite on click', async () => {
    await AsyncStorage.setFavorites([])
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(false)

    const { getByA11yLabel } = renderFavoriteButton()

    await waitFor(() => expect(getByA11yLabel(labels.favorites.add)).toBeTruthy())
    fireEvent.press(getByA11yLabel(labels.favorites.add))

    await waitFor(() => expect(getByA11yLabel(labels.favorites.remove)).toBeTruthy())
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(true)
  })

  it('should remove favorite on click', async () => {
    await AsyncStorage.setFavorites([document])
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(true)

    const { getByA11yLabel } = renderFavoriteButton()

    await waitFor(() => expect(getByA11yLabel(labels.favorites.remove)).toBeTruthy())
    fireEvent.press(getByA11yLabel(labels.favorites.remove))

    await waitFor(() => expect(getByA11yLabel(labels.favorites.add)).toBeTruthy())
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(false)
  })
})
