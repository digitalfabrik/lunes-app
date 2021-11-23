import { render } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { ARTICLES } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import FeedbackSection from '../FeedbackSection'

describe('Feedback section', () => {
  const document = {
    alternatives: [],
    article: ARTICLES[4],
    audio: '',
    id: 0,
    document_image: [],
    word: 'Abrissbirne'
  }

  it('should render correct feedback', () => {
    const submission = 'Die Abrissbirne'
    const { queryByText } = render(
      <FeedbackSection result='correct' submission={submission} document={document} needsToBeRepeated={false} />,
      {
        wrapper: wrapWithTheme
      }
    )
    expect(queryByText(labels.exercises.write.feedback.correct)).toBeTruthy()
  })

  it('should render similar feedback', () => {
    const submission = 'Der Abrissbirne'
    const { queryByText } = render(
      <FeedbackSection result='similar' submission={submission} document={document} needsToBeRepeated={false} />,
      {
        wrapper: wrapWithTheme
      }
    )

    expect(
      queryByText(
        `${labels.exercises.write.feedback.almostCorrect1} „${submission}“ ${labels.exercises.write.feedback.almostCorrect2}`
      )
    ).toBeTruthy()
  })

  it('should render finally incorrect feedback', () => {
    const submission = 'Der Hammer'
    const { queryByText } = render(
      <FeedbackSection result='incorrect' submission={submission} document={document} needsToBeRepeated={false} />,
      {
        wrapper: wrapWithTheme
      }
    )
    expect(
      queryByText(`${labels.exercises.write.feedback.wrong} „${document.article.value} ${document.word}“`)
    ).toBeTruthy()
  })

  it('should render incorrect feedback with retries not exceeded', () => {
    const submission = 'Der Hammer'
    const { queryByText } = render(
      <FeedbackSection result='incorrect' submission={submission} document={document} needsToBeRepeated={true} />,
      {
        wrapper: wrapWithTheme
      }
    )
    expect(queryByText(`${labels.exercises.write.feedback.wrongForRetry}`)).toBeTruthy()
  })
})
