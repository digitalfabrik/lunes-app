import React from 'react'

import labels from '../../../../constants/labels.json'
import DocumentBuilder from '../../../../testing/DocumentBuilder'
import render from '../../../../testing/render'
import AlternativeWordsSection from '../AlternativeWordsSection'

describe('AlternativeWords', () => {
  const documents = new DocumentBuilder(2).build()

  it('should display alternative words', () => {
    const { getByText } = render(<AlternativeWordsSection document={documents[0]} />)
    expect(getByText(labels.exercises.vocabularyList.alternativeWords)).toBeDefined()
    expect(
      getByText(
        `${documents[0].alternatives[0].article.value} ${documents[0].alternatives[0].word}, ${documents[0].alternatives[1].article.value} ${documents[0].alternatives[1].word}`
      )
    ).toBeDefined()
    expect(getByText(labels.exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })

  it('should not display alternative words, if word has none', () => {
    const { getByText, queryByText } = render(<AlternativeWordsSection document={documents[1]} />)
    expect(queryByText(labels.exercises.vocabularyList.alternativeWords)).toBeNull()
    expect(getByText(labels.exercises.vocabularyList.suggestAlternative)).toBeDefined()
  })
})
