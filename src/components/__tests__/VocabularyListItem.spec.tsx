import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { VocabularyItem } from '../../constants/endpoints'
import render from '../../testing/render'
import VocabularyListItem from '../VocabularyListItem'
import VocabularyItemBuilder from "../../testing/VocabularyItemBuilder";

jest.mock('../FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})
jest.mock('../AudioPlayer', () => () => null)

describe('VocabularyListItem', () => {
  const onPress = jest.fn()

  const vocabularyItem: VocabularyItem = new VocabularyItemBuilder(1).build()[0]

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
