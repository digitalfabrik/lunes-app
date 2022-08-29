import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Share } from 'react-native'

import { ARTICLES } from '../../../../constants/data'
import { DocumentResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
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

  const message = `${getLabels().results.share.message1} 'My Discipline' ${getLabels().results.share.message2} 1 ${
    getLabels().results.of
  } 2 ${getLabels().results.share.message3}`

  it('should call native share function', () => {
    const { getByText } = render(<ShareButton disciplineTitle='My Discipline' results={results} />)
    const button = getByText(getLabels().results.share.button)
    fireEvent.press(button)
    expect(Share.share).toHaveBeenCalledWith({ message })
  })
})
