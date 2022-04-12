import React from 'react'

import { ARTICLES } from '../../../../constants/data'
import { Document } from '../../../../constants/endpoints'
import render from '../../../../testing/render'
import VocabularyListItem from '../VocabularyListItem'

jest.mock('../../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../../components/AudioPlayer', () => () => null)

describe('VocabularyListItem', () => {
  const document: Document = {
    article: ARTICLES[1],
    audio: '',
    id: 0,
    document_image: [{ id: 1, image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg' }],
    word: 'Winkelmesser',
    alternatives: []
  }

  it('should display image passed to it', () => {
    const { getByTestId } = render(<VocabularyListItem document={document} />)
    expect(getByTestId('image')).toHaveProp('source', { uri: document.document_image[0].image })
  })

  it('should display article passed to it', () => {
    const { queryByText } = render(<VocabularyListItem document={document} />)
    expect(queryByText(document.article.value)).toBeTruthy()
  })

  it('should display word passed to it', () => {
    const { queryByText } = render(<VocabularyListItem document={document} />)
    expect(queryByText(document.word)).toBeTruthy()
  })
})
