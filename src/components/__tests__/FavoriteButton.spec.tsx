import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { DOCUMENT_TYPES } from '../../constants/data'
import { setFavorites, isFavorite } from '../../services/AsyncStorage'
import DocumentBuilder from '../../testing/DocumentBuilder'
import render from '../../testing/render'
import FavoriteButton from '../FavoriteButton'

describe('FavoriteButton', () => {
  const document = new DocumentBuilder(1).build()[0]
  const favorite = { id: document.id, documentType: DOCUMENT_TYPES.lunesStandard }

  const renderFavoriteButton = () =>
    render(
      <NavigationContainer>
        <FavoriteButton document={document} />
      </NavigationContainer>
    )

  it('should add favorite on click', async () => {
    await setFavorites([])
    await expect(isFavorite(favorite)).resolves.toBe(false)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    fireEvent.press(getByTestId('add'))

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    await expect(isFavorite(favorite)).resolves.toBe(true)
  })

  it('should remove favorite on click', async () => {
    await setFavorites([favorite])
    await expect(isFavorite(favorite)).resolves.toBe(true)

    const { getByTestId } = renderFavoriteButton()

    await waitFor(() => expect(getByTestId('remove')).toBeTruthy())
    fireEvent.press(getByTestId('remove'))

    await waitFor(() => expect(getByTestId('add')).toBeTruthy())
    await expect(isFavorite(favorite)).resolves.toBe(false)
  })
})
