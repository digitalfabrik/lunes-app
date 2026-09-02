import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { ARTICLES } from '../../constants/data'
import { FONT_SIZES } from '../../constants/theme/fonts'
import { hyphenate } from '../../services/hyphenation'
import render from '../../testing/render'
import WordItem from '../WordItem'

describe('WordItem', () => {
  const answer = { word: 'Arbeitsjacke', article: ARTICLES[2] }

  describe('when the word is the primary content of the screen', () => {
    it('should render the word prominently', () => {
      const { getByText } = render(<WordItem answer={answer} isPrimaryContent />)

      expect(getByText(answer.word)).toHaveStyle({ fontSize: FONT_SIZES.heading })
    })
  })

  describe('when the word is one of several answers', () => {
    it('should keep the word at body size so the options do not grow', () => {
      const { getByText } = render(<WordItem answer={answer} onClick={jest.fn()} />)

      expect(getByText(answer.word)).toHaveStyle({ fontSize: FONT_SIZES.body })
    })
  })

  describe('when the word is a long compound word', () => {
    const longWord = 'Schutzleiteranschluss'

    it('should render it with soft hyphens while keeping the plain word accessible', () => {
      const { getByLabelText } = render(<WordItem answer={{ word: longWord, article: ARTICLES[1] }} />)

      expect(getByLabelText(longWord)).toHaveTextContent(hyphenate(longWord))
    })
  })

  it('should report the selected answer when pressed', () => {
    const onClick = jest.fn()
    const { getByText } = render(<WordItem answer={answer} onClick={onClick} />)

    fireEvent.press(getByText(answer.word))

    expect(onClick).toHaveBeenCalledWith(answer)
  })
})
