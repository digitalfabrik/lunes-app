import { RenderAPI } from '@testing-library/react-native'
import React from 'react'
import 'react-native'

import { ARTICLES, SimpleResult } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import { DocumentResult } from '../../../../navigation/NavigationTypes'
import render from '../../../../testing/render'
import Feedback from '../Feedback'

describe('Feedback section', () => {
  const document = {
    alternatives: [],
    article: ARTICLES[4],
    audio: '',
    id: 0,
    document_image: [],
    word: 'Abrissbirne'
  }

  const renderFeedback = (
    result: SimpleResult,
    numberOfTries: number,
    submission: string,
    needsToBeRepeated: boolean
  ): RenderAPI => {
    const documentWithResult: DocumentResult = { document, result, numberOfTries }
    return render(
      <Feedback documentWithResult={documentWithResult} submission={submission} needsToBeRepeated={needsToBeRepeated} />
    )
  }

  it('should render correct feedback', () => {
    const submission = 'Die Abrissbirne'
    const { queryByText } = renderFeedback('correct', 1, submission, false)
    expect(queryByText(labels.exercises.write.feedback.correct.replace('\n', ''))).toBeTruthy()
  })

  it('should render similar feedback', () => {
    const submission = 'Die Abrissbirn'
    const { queryByText } = renderFeedback('similar', 1, submission, true)

    expect(
      queryByText(
        `${labels.exercises.write.feedback.almostCorrect1} „${submission}“ ${labels.exercises.write.feedback.almostCorrect2}`
      )
    ).toBeTruthy()
  })

  it('should render finally incorrect feedback', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderFeedback('incorrect', 1, submission, false)

    expect(
      queryByText(`${labels.exercises.write.feedback.wrongWithSolution} „${document.article.value} ${document.word}“`)
    ).toBeTruthy()
  })

  it('should render incorrect feedback with retries not exceeded', () => {
    const submission = 'Der Auto'
    const { queryByText } = renderFeedback('incorrect', 1, submission, true)

    expect(
      queryByText(
        `${labels.exercises.write.feedback.wrong} ${labels.exercises.write.feedback.wrongWithSolution} „${document.article.value} ${document.word}“`
      )
    ).toBeTruthy()
  })
})
