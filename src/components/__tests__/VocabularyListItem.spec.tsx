import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import DocumentBuilder from '../../testing/DocumentBuilder'
import render from '../../testing/render'
import VocabularyListItem from '../VocabularyListItem'

jest.mock('../FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})
jest.mock('../AudioPlayer', () => () => null)

describe('VocabularyListItem', () => {
  const onPress = jest.fn()

  const document = new DocumentBuilder(1).build()[0]

  it('should display image passed to it', () => {
    const { getByTestId } = render(<VocabularyListItem document={document} onPress={onPress} />)
    expect(getByTestId('image')).toHaveProp('source', { uri: document.document_image[0].image })
  })

  it('should display article passed to it', () => {
    const { queryByText } = render(<VocabularyListItem document={document} onPress={onPress} />)
    expect(queryByText(document.article.value)).toBeTruthy()
  })

  it('should display word passed to it', () => {
    const { getByText } = render(<VocabularyListItem document={document} onPress={onPress} />)
    expect(getByText(document.word)).toBeTruthy()

    expect(onPress).toHaveBeenCalledTimes(0)
    fireEvent.press(getByText(document.word))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
