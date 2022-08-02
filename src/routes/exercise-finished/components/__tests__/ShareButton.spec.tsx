import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Share } from 'react-native'

import { ARTICLES } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import { DocumentResult } from '../../../../navigation/NavigationTypes'
import render from '../../../../testing/render'
import ShareButton from '../ShareButton'

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(),
}))

describe('ShareButton', () => {
  const results: DocumentResult[] = [
    {
      document: {
        id: 1,
        word: 'Auto',
        article: ARTICLES[1],
        document_image: [{ id: 1, image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg' }],
        audio: 'audio',
        alternatives: [],
      },
      result: 'correct',
      numberOfTries: 1,
    },
    {
      document: {
        id: 2,
        word: 'Nagel',
        article: ARTICLES[1],
        document_image: [{ id: 1, image: 'https://lunes.tuerantuer.org/media/images/Winkelmesser.jpeg' }],
        audio: 'audio',
        alternatives: [],
      },
      result: 'incorrect',
      numberOfTries: 1,
    },
  ]

  const message = `${labels.results.share.message1} 'My Discipline' ${labels.results.share.message2} 1 ${labels.results.of} 2 ${labels.results.share.message3}`

  it('should call native share function', () => {
    const { getByText } = render(<ShareButton disciplineTitle='My Discipline' results={results} />)
    const button = getByText(labels.results.share.button)
    fireEvent.press(button)
    expect(Share.share).toHaveBeenCalledWith({ message })
  })
})
