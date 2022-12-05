import React from 'react'

import { getLabels } from '../../../../services/helpers'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import render from '../../../../testing/render'
import AlternativeWordsSection from '../AlternativeWordsSection'

describe('AlternativeWords', () => {
  const vocabularyItems = new VocabularyItemBuilder(2).build()

  it('should display alternative words', () => {
    const { getByText } = render(<AlternativeWordsSection vocabularyItem={vocabularyItems[0]} />)
    expect(getByText(getLabels().exercises.vocabularyList.alternativeWords)).toBeDefined()
    expect(
      getByText(
        `${vocabularyItems[0].alternatives[0].article.value} ${vocabularyItems[0].alternatives[0].word}, ${vocabularyItems[0].alternatives[1].article.value} ${vocabularyItems[0].alternatives[1].word}`
      )
    ).toBeDefined()
    expect(getByText(getLabels().exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })

  it('should not display alternative words, if word has none', () => {
    const { getByText, queryByText } = render(<AlternativeWordsSection vocabularyItem={vocabularyItems[1]} />)
    expect(queryByText(getLabels().exercises.vocabularyList.alternativeWords)).toBeNull()
    expect(getByText(getLabels().exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })
})
