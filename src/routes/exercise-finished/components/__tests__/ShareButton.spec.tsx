import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Share } from 'react-native'

import { ARTICLES } from '../../../../constants/data'
import { DocumentResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import DocumentBuilder from '../../../../testing/DocumentBuilder'
import render from '../../../../testing/render'
import ShareButton from '../ShareButton'

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(),
}))

describe('ShareButton', () => {
  const documents = new DocumentBuilder(1).build()
  const results: DocumentResult[] = [
    {
      document: documents[0],
      result: 'correct',
      numberOfTries: 1,
    },
    {
      document: documents[1],
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
