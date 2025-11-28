import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Share } from 'react-native'

import { VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import render from '../../../../testing/render'
import ShareButton from '../ShareButton'

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(),
}))

describe('ShareButton', () => {
  const vocabularyItems = new VocabularyItemBuilder(1).build()
  const results: VocabularyItemResult[] = [
    {
      vocabularyItem: vocabularyItems[0],
      result: 'correct',
      numberOfTries: 1,
    },
    {
      vocabularyItem: vocabularyItems[1],
      result: 'incorrect',
      numberOfTries: 1,
    },
  ]

  const message = `${getLabels().results.share.message1} 'My Unit' ${getLabels().results.share.message2} 1 ${
    getLabels().results.of
  } 2 ${getLabels().results.share.message3}`

  it('should call native share function', () => {
    const { getByText } = render(<ShareButton unitTitle='My Unit' results={results} />)
    const button = getByText(getLabels().results.share.button)
    fireEvent.press(button)
    expect(Share.share).toHaveBeenCalledWith({ message })
  })
})
