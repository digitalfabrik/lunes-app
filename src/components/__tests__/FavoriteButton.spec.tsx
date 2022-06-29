import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

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
    await expect(AsyncStorage.isFavorite(document.id)).resolves.toBe(false)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    fireEvent.press(getByTestId('add'))

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    await expect(AsyncStorage.isFavorite(document.id)).resolves.toBe(true)
  })

  it('should remove favorite on click', async () => {
    await AsyncStorage.setFavorites([document.id])
    await expect(AsyncStorage.isFavorite(document.id)).resolves.toBe(true)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    fireEvent.press(getByTestId('remove'))

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    await expect(AsyncStorage.isFavorite(document.id)).resolves.toBe(false)
  })
})
