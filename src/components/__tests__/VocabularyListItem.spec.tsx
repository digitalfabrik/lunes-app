import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { ARTICLES } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import render from '../../testing/render'
import VocabularyListItem from '../VocabularyListItem'

jest.mock('../FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})
jest.mock('../AudioPlayer', () => () => null)

describe('VocabularyListItem', () => {
  const onPress = jest.fn()

  const vocabularyItem: VocabularyItem = {
    article: ARTICLES[1],
    audio: '',
    id: 0,
    document_image: [{ id: 1, image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg' }],
    word: 'Winkelmesser',
    alternatives: [],
  }

  it('should display image passed to it', () => {
    const { getByTestId } = render(<VocabularyListItem vocabularyItem={vocabularyItem} onPress={onPress} />)
    expect(getByTestId('image')).toHaveProp('source', { uri: vocabularyItem.document_image[0].image })
  })

  it('should display article passed to it', () => {
    const { queryByText } = render(<VocabularyListItem vocabularyItem={vocabularyItem} onPress={onPress} />)
    expect(queryByText(vocabularyItem.article.value)).toBeTruthy()
  })

  it('should display word passed to it', () => {
    const { getByText } = render(<VocabularyListItem vocabularyItem={vocabularyItem} onPress={onPress} />)
    expect(getByText(vocabularyItem.word)).toBeTruthy()

    expect(onPress).toHaveBeenCalledTimes(0)
    fireEvent.press(getByText(vocabularyItem.word))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
