import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import AsyncStorage from '../../services/AsyncStorage'
import DocumentBuilder from '../../testing/DocumentBuilder'
import render from '../../testing/render'
import FavoriteButton from '../FavoriteButton'

describe('FavoriteButton', () => {
  const document = new DocumentBuilder(1).build()[0]

  it('should add favorite on click', async () => {
    await AsyncStorage.setFavorites([])
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(false)

    const { getByA11yLabel } = render(<FavoriteButton document={document} />)

    await waitFor(() => expect(getByA11yLabel(labels.favorites.add)).toBeTruthy())
    fireEvent.press(getByA11yLabel(labels.favorites.add))

    expect(getByA11yLabel(labels.favorites.remove)).toBeTruthy()
    await waitFor(() => expect(AsyncStorage.isFavorite(document)).resolves.toBe(true))
  })

  it('should remove favorite on click', async () => {
    await AsyncStorage.setFavorites([document])
    await expect(AsyncStorage.isFavorite(document)).resolves.toBe(true)

    const { getByA11yLabel } = render(<FavoriteButton document={document} />)

    await waitFor(() => expect(getByA11yLabel(labels.favorites.remove)).toBeTruthy())
    fireEvent.press(getByA11yLabel(labels.favorites.remove))

    expect(getByA11yLabel(labels.favorites.add)).toBeTruthy()
    await waitFor(() => expect(AsyncStorage.isFavorite(document)).resolves.toBe(false))
  })
})
